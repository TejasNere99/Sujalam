import { FarmLabour, IFarmLabour } from '../models/FarmLabour';
import { FarmMachinery, IFarmMachinery } from '../models/FarmMachinery';
import mongoose from 'mongoose';

export class ResourceAvailabilityService {
  /**
   * Get all currently available labour within a given radius matching a specific type
   */
  async getAvailableLabour(
    longitude: number, 
    latitude: number, 
    maxDistanceKm: number,
    labourType?: string,
    requiredDate?: Date
  ): Promise<IFarmLabour[]> {
    const query: any = {
      active: true,
      availability_status: 'AVAILABLE',
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistanceKm * 1000 // Convert km to meters
        }
      }
    };

    if (labourType) {
      query.labour_type = labourType;
    }

    if (requiredDate) {
      query.available_from = { $lte: requiredDate };
      query.available_until = { $gte: requiredDate };
    }

    return FarmLabour.find(query).lean();
  }

  /**
   * Get all currently available machinery within a given radius matching a specific type
   */
  async getAvailableMachinery(
    longitude: number, 
    latitude: number, 
    maxDistanceKm: number,
    machineType?: string,
    requiredDate?: Date
  ): Promise<IFarmMachinery[]> {
    const query: any = {
      active: true,
      availability_status: 'AVAILABLE',
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistanceKm * 1000
        }
      }
    };

    if (machineType) {
      query.machine_type = machineType;
    }

    if (requiredDate) {
      query.available_from = { $lte: requiredDate };
      query.available_until = { $gte: requiredDate };
    }

    return FarmMachinery.find(query).lean();
  }

  /**
   * Check exact availability by ID
   */
  async checkLabourAvailability(labourId: string, requiredWorkers: number): Promise<boolean> {
    const labour = await FarmLabour.findById(labourId);
    if (!labour) return false;
    if (!labour.active || labour.availability_status !== 'AVAILABLE') return false;
    if (labour.workers_available < requiredWorkers) return false;
    return true;
  }

  async checkMachineryAvailability(machineId: string): Promise<boolean> {
    const machine = await FarmMachinery.findById(machineId);
    if (!machine) return false;
    if (!machine.active || machine.availability_status !== 'AVAILABLE') return false;
    return true;
  }
}

export const resourceAvailabilityService = new ResourceAvailabilityService();
