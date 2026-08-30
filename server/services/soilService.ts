import { SoilReading } from '../models/SoilReading';
import { assertFarmOwnership } from '../lib/auth';
import { soilSchema } from '../validation';
import { resilienceState } from '../resilience/resilienceState';
import { appendEvent } from '../resilience/eventLogService';
import mongoose from 'mongoose';

export const getSoilHistory = async (userId: string, farmId: string) => {
  if (resilienceState.isBlackout()) {
    const recovered = resilienceState.getRecoveredState();
    if (recovered) {
      const readings = Array.from(recovered.soil_readings.values())
        .filter(r => r.farm_id === farmId || r.farm_id?.toString() === farmId)
        .sort((a: any, b: any) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());
      return readings.map(r => ({ ...r, id: r._id.toString() }));
    }
    return [];
  }
  await assertFarmOwnership(userId, farmId);
  const readings = await SoilReading.find({ farm_id: farmId }).sort({ recorded_at: -1 }).lean();
  return readings.map(r => ({ ...r, id: r._id.toString() }));
};

export const getLatestSoilReading = async (userId: string, farmId: string) => {
  if (resilienceState.isBlackout()) {
    const recovered = resilienceState.getRecoveredState();
    if (recovered) {
      const readings = Array.from(recovered.soil_readings.values())
        .filter(r => r.farm_id === farmId || r.farm_id?.toString() === farmId)
        .sort((a: any, b: any) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());
      return readings[0] ? { ...readings[0], id: readings[0]._id.toString() } : null;
    }
    return null;
  }
  await assertFarmOwnership(userId, farmId);
  const reading = await SoilReading.findOne({ farm_id: farmId }).sort({ recorded_at: -1 }).lean();
  return reading ? { ...reading, id: reading._id.toString() } : null;
};

export const createSoilReading = async (userId: string, farmId: string, input: any) => {
  const data = soilSchema.parse(input);
  
  if (resilienceState.isBlackout()) {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const payload = { 
      farm_id: farmId, 
      recorded_at: data.recorded_at ? new Date(data.recorded_at) : new Date(),
      ...data,
      _id: fakeId 
    };
    await appendEvent('SOIL_READING_CREATED', 'SoilReading', fakeId, farmId, userId, payload, 'PENDING_RECOVERY_SYNC');
    resilienceState.getRecoveredState()?.soil_readings.set(fakeId, payload);
    return { ...payload, id: fakeId };
  }

  await assertFarmOwnership(userId, farmId);
  const reading = new SoilReading({ 
    farm_id: farmId, 
    recorded_at: data.recorded_at ? new Date(data.recorded_at) : new Date(),
    ...data 
  });
  await reading.save();
  return { ...reading.toObject(), id: reading._id.toString() };
};
