import { Advisory } from '../models/Advisory';
import { assertFarmOwnership } from '../lib/auth';
import { generateAdvisoryData } from '../decision/decisionEngine';
import { getLatestSoilReading } from './soilService';
import { getWeather } from './weatherService';
import { getLatestCropHealth } from './cropHealthService';
import { getMarketPrice } from './marketService';
import { resilienceState } from '../resilience/resilienceState';
import { appendEvent } from '../resilience/eventLogService';
import mongoose from 'mongoose';
import { Farm } from '../models/Farm';
import { resourceMatchingService } from './resourceMatchingService';
import { getActiveCrop } from './cropService';

export const getLatestAdvisory = async (userId: string, farmId: string) => {
  if (resilienceState.isBlackout()) {
    const recovered = resilienceState.getRecoveredState();
    if (recovered) {
      const advs = Array.from(recovered.advisories.values())
        .filter(a => a.farm_id === farmId || a.farm_id?.toString() === farmId)
        .sort((a: any, b: any) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime());
      return advs[0] ? { ...advs[0], id: advs[0]._id.toString() } : null;
    }
    return null; // Should not happen if state is loaded
  }

  await assertFarmOwnership(userId, farmId);
  const adv = await Advisory.findOne({ farm_id: farmId }).sort({ generated_at: -1 }).lean();
  return adv ? { ...adv, id: adv._id.toString() } : null;
};

export const getAdvisories = async (userId: string, farmId: string) => {
  if (resilienceState.isBlackout()) {
    const recovered = resilienceState.getRecoveredState();
    if (recovered) {
      const advs = Array.from(recovered.advisories.values())
        .filter(a => a.farm_id === farmId || a.farm_id?.toString() === farmId)
        .sort((a: any, b: any) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime());
      return advs.map(a => ({ ...a, id: a._id.toString() }));
    }
    return [];
  }

  await assertFarmOwnership(userId, farmId);
  const advs = await Advisory.find({ farm_id: farmId }).sort({ generated_at: -1 }).lean();
  return advs.map(a => ({ ...a, id: a._id.toString() }));
};

export const refreshFarmAdvisory = async (userId: string, farmId: string) => {
  if (!resilienceState.isBlackout()) {
    await assertFarmOwnership(userId, farmId);
  }

  // Load Context (Services themselves should be blackout-aware)
  const soil = await getLatestSoilReading(userId, farmId);
  const weather = await getWeather(userId, farmId);
  const cropHealth = await getLatestCropHealth(userId, farmId);
  const market = await getMarketPrice(userId, farmId);
  const crop = await getActiveCrop(userId, farmId);

  let resourceMatches;
  try {
    const farm = await Farm.findById(farmId);
    if (farm) {
      // Default to HARVESTING for the demo if near maturity, else IRRIGATION
      const operation = crop?.growth_stage === 'Maturity' || crop?.growth_stage === 'Harvesting' ? 'HARVESTING' : 'IRRIGATION';
      
      // Use Delhi coordinates as fallback for demo data matching if farm has none
      const longitude = farm.longitude || 77.1025;
      const latitude = farm.latitude || 28.7041;

      const matches = await resourceMatchingService.findMatches({
        longitude,
        latitude,
        operation,
        requiredDate: new Date(),
        farmAreaAcres: farm.area_acres || 1
      });
      resourceMatches = {
        labour: matches.labour,
        machinery: matches.machinery,
        requested_operation: operation,
        requiredDate: new Date().toISOString()
      };
    }
  } catch (e) {
    console.error('Failed to fetch resource matches for advisory:', e);
  }

  // Generate New Advisory via AI Pipeline
  const advisoryData = await generateAdvisoryData(farmId, soil, weather, cropHealth, market, resourceMatches);
  
  if (resilienceState.isBlackout()) {
    advisoryData.ai_metadata = advisoryData.ai_metadata || {};
    advisoryData.ai_metadata.recovery_mode = true;
    advisoryData.ai_metadata.data_source = 'reconstructed_state';
    
    // Simulate ID generation
    const fakeId = new mongoose.Types.ObjectId().toString();
    const payload = { ...advisoryData, _id: fakeId };
    
    // Persist to Event Log instead of DB
    await appendEvent('ADVISORY_CREATED', 'Advisory', fakeId, farmId, userId, payload, 'PENDING_RECOVERY_SYNC');
    
    // Update local memory
    resilienceState.getRecoveredState()?.advisories.set(fakeId, payload);
    return { ...payload, id: fakeId };
  }

  // Normal Persist
  const advisory = new Advisory(advisoryData);
  await advisory.save();
  // We should also log APPLIED to the event log if we wanted a full event source architecture. 
  // But for the hackathon, we only need to track pending events to restore.
  
  return { ...advisory.toObject(), id: advisory._id.toString() };
};
