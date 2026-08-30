import { resourceAvailabilityService } from './resourceAvailabilityService';
import { IFarmLabour } from '../models/FarmLabour';
import { IFarmMachinery } from '../models/FarmMachinery';

export interface ResourceMatchRequest {
  longitude: number;
  latitude: number;
  operation: string; // e.g., 'HARVESTING', 'IRRIGATION', 'SPRAYING'
  requiredDate: Date;
  farmAreaAcres?: number;
  requiredWorkers?: number;
  requiredMachineType?: string;
}

export interface MatchedResource {
  resource_id: string;
  provider_id: string;
  type: 'LABOUR' | 'MACHINERY';
  name: string;
  rate: number;
  rate_type: 'HOURLY' | 'DAILY';
  distance_km: number;
  match_score: number;
  operator_available?: boolean;
  available_from: Date;
  available_until: Date;
}

export class ResourceMatchingService {
  /**
   * Helper function to calculate distance using Haversine formula
   */
  private calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180); 
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c; // Distance in km
  }

  /**
   * Find matching resources deterministically based on location, type, and availability
   */
  async findMatches(request: ResourceMatchRequest): Promise<{ labour: MatchedResource[], machinery: MatchedResource[] }> {
    const maxRadius = 50; // default 50km radius search
    let matchedLabour: MatchedResource[] = [];
    let matchedMachinery: MatchedResource[] = [];

    // 1. Match Machinery if requested or implied by operation
    let mType = request.requiredMachineType;
    if (!mType) {
      if (request.operation.toUpperCase() === 'IRRIGATION') mType = 'PUMP';
      if (request.operation.toUpperCase() === 'HARVESTING') mType = 'HARVESTER';
      if (request.operation.toUpperCase() === 'SPRAYING') mType = 'SPRAYER';
    }

    if (mType) {
      const machineryCandidates = await resourceAvailabilityService.getAvailableMachinery(
        request.longitude,
        request.latitude,
        maxRadius,
        mType.toUpperCase(),
        request.requiredDate
      );

      matchedMachinery = machineryCandidates.map(m => {
        const dist = this.calculateDistanceKm(request.latitude, request.longitude, m.location.coordinates[1], m.location.coordinates[0]);
        // Simple deterministic scoring: close distance = higher score, cheaper = higher score
        const score = (100 - dist) + (1000 / (m.hourly_rate || 1));
        return {
          resource_id: m._id!.toString(),
          provider_id: m.provider_id,
          type: 'MACHINERY' as const,
          name: m.machine_name,
          rate: m.hourly_rate,
          rate_type: 'HOURLY' as const,
          distance_km: Number(dist.toFixed(1)),
          match_score: score,
          operator_available: m.operator_available,
          available_from: m.available_from,
          available_until: m.available_until
        };
      }).sort((a, b) => b.match_score - a.match_score);
    }

    // 2. Match Labour if requested or implied
    let lType = undefined;
    if (request.requiredWorkers || request.operation) {
      if (request.operation.toUpperCase() === 'HARVESTING') lType = 'HARVESTING';
      else if (request.operation.toUpperCase() === 'SPRAYING') lType = 'SPRAYING';
      else if (request.operation.toUpperCase() === 'IRRIGATION') lType = 'IRRIGATION';
      else lType = 'GENERAL';

      const labourCandidates = await resourceAvailabilityService.getAvailableLabour(
        request.longitude,
        request.latitude,
        maxRadius,
        lType,
        request.requiredDate
      );

      // Filter by required workers
      const validLabour = request.requiredWorkers ? 
        labourCandidates.filter(l => l.workers_available >= (request.requiredWorkers || 1)) : 
        labourCandidates;

      matchedLabour = validLabour.map(l => {
        const dist = this.calculateDistanceKm(request.latitude, request.longitude, l.location.coordinates[1], l.location.coordinates[0]);
        const score = (100 - dist) + (1000 / ((l.hourly_rate || l.daily_rate) || 1));
        return {
          resource_id: l._id!.toString(),
          provider_id: l.provider_id,
          type: 'LABOUR' as const,
          name: l.name,
          rate: l.hourly_rate || (l.daily_rate || 0),
          rate_type: (l.hourly_rate ? 'HOURLY' : 'DAILY') as 'HOURLY' | 'DAILY',
          distance_km: Number(dist.toFixed(1)),
          match_score: score,
          available_from: l.available_from,
          available_until: l.available_until
        };
      }).sort((a, b) => b.match_score - a.match_score);
    }

    return {
      labour: matchedLabour,
      machinery: matchedMachinery
    };
  }
}

export const resourceMatchingService = new ResourceMatchingService();
