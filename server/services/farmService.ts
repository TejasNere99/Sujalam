import { Farm } from '../models/Farm';
import { assertFarmOwnership } from '../lib/auth';
import { farmSchema } from '../validation';
import { resilienceState } from '../resilience/resilienceState';
import { appendEvent } from '../resilience/eventLogService';
import mongoose from 'mongoose';

export const getFarmsByUser = async (userId: string) => {
  if (resilienceState.isBlackout()) {
    const recovered = resilienceState.getRecoveredState();
    if (recovered) {
      const farms = Array.from(recovered.farms.values())
        .filter(f => f.user_id === userId || f.user_id?.toString() === userId);
      return farms.map(f => ({ ...f, id: f._id.toString() }));
    }
    return [];
  }
  const farms = await Farm.find({ user_id: userId }).lean();
  return farms.map(f => ({ ...f, id: f._id.toString() }));
};

export const getFarmById = async (userId: string, farmId: string) => {
  if (resilienceState.isBlackout()) {
    const recovered = resilienceState.getRecoveredState();
    if (recovered) {
      const farm = recovered.farms.get(farmId);
      if (farm && (farm.user_id === userId || farm.user_id?.toString() === userId)) {
        return { ...farm, id: farm._id.toString() };
      }
      throw new Error('Farm not found or unauthorized (Recovery Mode)');
    }
  }

  const farm = await assertFarmOwnership(userId, farmId);
  return { ...farm.toObject(), id: farm._id.toString() };
};

export const createFarm = async (userId: string, input: any) => {
  const data = farmSchema.parse(input);

  if (resilienceState.isBlackout()) {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const payload = { user_id: userId, ...data, _id: fakeId, created_at: new Date(), updated_at: new Date() };
    await appendEvent('FARM_CREATED', 'Farm', fakeId, fakeId, userId, payload, 'PENDING_RECOVERY_SYNC');
    resilienceState.getRecoveredState()?.farms.set(fakeId, payload);
    return { ...payload, id: fakeId };
  }

  const farm = new Farm({ user_id: userId, ...data });
  await farm.save();
  return { ...farm.toObject(), id: farm._id.toString() };
};

export const updateFarm = async (userId: string, farmId: string, input: any) => {
  const data = farmSchema.parse(input);

  if (resilienceState.isBlackout()) {
    const recovered = resilienceState.getRecoveredState();
    if (recovered) {
      const farm = recovered.farms.get(farmId);
      if (farm && (farm.user_id === userId || farm.user_id?.toString() === userId)) {
        const payload = { ...farm, ...data, updated_at: new Date() };
        await appendEvent('FARM_UPDATED', 'Farm', farmId, farmId, userId, payload, 'PENDING_RECOVERY_SYNC');
        recovered.farms.set(farmId, payload);
        return { ...payload, id: farmId };
      }
    }
    throw new Error('Farm not found or unauthorized (Recovery Mode)');
  }

  await assertFarmOwnership(userId, farmId);
  const farm = await Farm.findByIdAndUpdate(farmId, { $set: data }, { new: true }).lean();
  return { ...farm, id: farm!._id.toString() };
};

export const deleteFarm = async (userId: string, farmId: string) => {
  if (resilienceState.isBlackout()) {
    throw new Error('Deletions are not permitted during Recovery Mode to prevent cascading sync failures.');
  }
  await assertFarmOwnership(userId, farmId);
  await Farm.findByIdAndDelete(farmId);
  return { success: true };
};
