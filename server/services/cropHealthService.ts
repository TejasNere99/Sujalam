import { CropHealth } from '../models/CropHealth';
import { assertFarmOwnership } from '../lib/auth';
import { getActiveCrop } from './cropService';
import { resilienceState } from '../resilience/resilienceState';
import { appendEvent } from '../resilience/eventLogService';
import mongoose from 'mongoose';

export const getLatestCropHealth = async (userId: string, farmId: string) => {
  if (resilienceState.isBlackout()) {
    const recovered = resilienceState.getRecoveredState();
    if (recovered) {
      const healths = Array.from(recovered.crop_health.values())
        .filter(h => h.farm_id === farmId || h.farm_id?.toString() === farmId)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return healths[0] ? { ...healths[0], id: healths[0]._id.toString() } : null;
    }
    return null;
  }
  await assertFarmOwnership(userId, farmId);
  const health = await CropHealth.findOne({ farm_id: farmId }).sort({ created_at: -1 }).lean();
  return health ? { ...health, id: health._id.toString() } : null;
};

export const analyzeCropImage = async (userId: string, farmId: string, cropId: string | null, imageUrl: string) => {
  if (!resilienceState.isBlackout()) {
    await assertFarmOwnership(userId, farmId);
  }
  
  const activeCrop = await getActiveCrop(userId, farmId);
  const targetCropId = cropId || (activeCrop ? activeCrop.id : null);
  
  // For hackathon, if LIVE API key not configured, simulate Plant.id response
  const isMock = process.env.CROP_HEALTH_MODE === 'mock' || !process.env.PLANT_ID_API_KEY;

  let healthStatus = 'needs_attention';
  let diseaseName = 'Leaf Spot';
  let diseaseProb = 81;
  let action = 'Inspect affected leaves today.';

  if (!isMock && process.env.PLANT_ID_API_KEY) {
    try {
      const response = await fetch('https://api.plant.id/v2/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.PLANT_ID_API_KEY
        },
        body: JSON.stringify({
          images: [imageUrl],
          modifiers: ["crops_fast", "similar_images"],
          disease_details: ["cause", "common_names", "classification", "description", "treatment"]
        })
      });
      const data = await response.json();

      if (response.ok && data.suggestions && data.suggestions.length > 0) {
        const topSuggestion = data.suggestions[0];
        diseaseName = topSuggestion.plant_name;
        diseaseProb = Math.round(topSuggestion.probability * 100);
        
        if (topSuggestion.plant_details && topSuggestion.plant_details.treatment) {
            action = topSuggestion.plant_details.treatment.description || action;
        }

        healthStatus = diseaseProb > 50 ? 'needs_attention' : 'healthy';
      }
    } catch (e) {
      console.error('Plant ID API Error:', e);
    }
  }

  const healthData = {
    farm_id: farmId,
    crop_id: targetCropId ? targetCropId : null,
    image_url: imageUrl,
    crop_name: activeCrop ? activeCrop.crop_name : null,
    disease_name: diseaseName,
    disease_probability: diseaseProb,
    health_status: healthStatus,
    recommended_action: action,
    source: isMock ? 'mock' : 'plant.id',
    created_at: new Date()
  };

  if (resilienceState.isBlackout()) {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const payload = { ...healthData, _id: fakeId };
    await appendEvent('CROP_HEALTH_CREATED', 'CropHealth', fakeId, farmId, userId, payload, 'PENDING_RECOVERY_SYNC');
    resilienceState.getRecoveredState()?.crop_health.set(fakeId, payload);
    return { ...payload, id: fakeId };
  }

  const health = new CropHealth({
    ...healthData,
    crop_id: targetCropId ? new mongoose.Types.ObjectId(targetCropId) : null
  });

  await health.save();
  return { ...health.toObject(), id: health._id.toString() };
};
