import { Farm } from '../models/Farm';
import mongoose from 'mongoose';

/**
 * Asserts that the farm exists and belongs to the specified user.
 * @param userId - The ID of the authenticated user
 * @param farmId - The ID of the farm to check
 * @returns The farm document if successful
 * @throws Error if farm is not found or unauthorized
 */
export const assertFarmOwnership = async (userId: string, farmId: string) => {
  if (!mongoose.Types.ObjectId.isValid(farmId)) {
    throw new Error('INVALID_FARM_ID');
  }

  const farm = await Farm.findById(farmId);
  
  if (!farm) {
    throw new Error('FARM_NOT_FOUND');
  }

  if (farm.user_id.toString() !== userId) {
    throw new Error('FORBIDDEN');
  }

  return farm;
};
