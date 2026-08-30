import { FarmCrop } from '../models/FarmCrop';
import { assertFarmOwnership } from '../lib/auth';
import { cropSchema } from '../validation';
import { resilienceState } from '../resilience/resilienceState';
import { appendEvent } from '../resilience/eventLogService';
import mongoose from 'mongoose';

export const getCrops = async (userId: string, farmId: string) => {
  if (resilienceState.isBlackout()) {
    const recovered = resilienceState.getRecoveredState();
    if (recovered) {
      const crops = Array.from(recovered.farm_crops.values())
        .filter(c => c.farm_id === farmId || c.farm_id?.toString() === farmId);
      return crops.map(c => ({ ...c, id: c._id.toString() }));
    }
    return [];
  }
  await assertFarmOwnership(userId, farmId);
  const crops = await FarmCrop.find({ farm_id: farmId }).lean();
  return crops.map(c => ({ ...c, id: c._id.toString() }));
};

export const getActiveCrop = async (userId: string, farmId: string) => {
  if (resilienceState.isBlackout()) {
    const recovered = resilienceState.getRecoveredState();
    if (recovered) {
      const crops = Array.from(recovered.farm_crops.values())
        .filter(c => c.farm_id === farmId || c.farm_id?.toString() === farmId)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return crops[0] ? { ...crops[0], id: crops[0]._id.toString() } : null;
    }
    return null;
  }
  await assertFarmOwnership(userId, farmId);
  const crop = await FarmCrop.findOne({ farm_id: farmId }).sort({ created_at: -1 }).lean();
  return crop ? { ...crop, id: crop._id.toString() } : null;
};

export const createCrop = async (userId: string, farmId: string, input: any) => {
  const data = cropSchema.parse(input);

  if (resilienceState.isBlackout()) {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const payload = { farm_id: farmId, ...data, _id: fakeId, created_at: new Date() };
    await appendEvent('CROP_CREATED', 'FarmCrop', fakeId, farmId, userId, payload, 'PENDING_RECOVERY_SYNC');
    resilienceState.getRecoveredState()?.farm_crops.set(fakeId, payload);
    return { ...payload, id: fakeId };
  }

  await assertFarmOwnership(userId, farmId);
  const crop = new FarmCrop({ farm_id: farmId, ...data });
  await crop.save();
  return { ...crop.toObject(), id: crop._id.toString() };
};

export const updateCrop = async (userId: string, farmId: string, cropId: string, input: any) => {
  const data = cropSchema.parse(input);

  if (resilienceState.isBlackout()) {
    const recovered = resilienceState.getRecoveredState();
    if (recovered) {
      const crop = recovered.farm_crops.get(cropId);
      if (crop && (crop.farm_id === farmId || crop.farm_id?.toString() === farmId)) {
        const payload = { ...crop, ...data };
        await appendEvent('CROP_UPDATED', 'FarmCrop', cropId, farmId, userId, payload, 'PENDING_RECOVERY_SYNC');
        recovered.farm_crops.set(cropId, payload);
        return { ...payload, id: cropId };
      }
    }
    throw new Error('CROP_NOT_FOUND_OR_UNAUTHORIZED_IN_RECOVERY');
  }

  await assertFarmOwnership(userId, farmId);
  // Ensure the crop belongs to the farm
  const crop = await FarmCrop.findOne({ _id: cropId, farm_id: farmId });
  if (!crop) throw new Error('CROP_NOT_FOUND');

  const updatedCrop = await FarmCrop.findByIdAndUpdate(cropId, { $set: data }, { new: true }).lean();
  return { ...updatedCrop, id: updatedCrop!._id.toString() };
};
