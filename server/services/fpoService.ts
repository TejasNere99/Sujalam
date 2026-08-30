import { FPO } from '../models/FPO';
import { assertFarmOwnership } from '../lib/auth';
import { Farm } from '../models/Farm';

// Haversine distance calculation in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

export const getNearbyFPOs = async (userId: string, farmId: string) => {
  // MUST assert ownership
  const farm = await assertFarmOwnership(userId, farmId);
  const farmDoc = await Farm.findById(farmId);
  
  if (!farmDoc) {
    throw new Error('Farm not found');
  }

  // Find all active & VERIFIED FPOs (Prioritizing matching state/district)
  const allFPOs = await FPO.find({ active: true, verified: true }).lean();
  
  if (allFPOs.length === 0) {
    return {
      fpos: [],
      data_status: 'official_data_unavailable'
    };
  }

  let fposWithDistance = allFPOs.map(fpo => {
    let distance_km = null;
    
    // Calculate precise distance ONLY if BOTH farm and FPO have valid coordinates
    if (farmDoc.latitude && farmDoc.longitude && fpo.latitude && fpo.longitude) {
      distance_km = calculateDistance(farmDoc.latitude, farmDoc.longitude, fpo.latitude, fpo.longitude);
      distance_km = Math.round(distance_km * 10) / 10;
    }
    
    // Only extract necessary fields, removing internal MongoDB _id
    return {
      id: (fpo as any)._id.toString(),
      name: fpo.name,
      registration_number: fpo.registration_number,
      district: fpo.district,
      state: fpo.state,
      address: fpo.address,
      latitude: fpo.latitude,
      longitude: fpo.longitude,
      distance_km,
      member_count: fpo.member_count,
      phone: fpo.phone,
      whatsapp: fpo.whatsapp,
      website: fpo.website,
      services: fpo.services,
      verified: fpo.verified,
      source_name: fpo.source_name,
      source_url: fpo.source_url,
      last_verified_at: fpo.last_verified_at
    };
  });

  // Sort by nearest distance if available, otherwise by those that share the exact district
  fposWithDistance.sort((a, b) => {
    if (a.distance_km !== null && b.distance_km !== null) {
      return a.distance_km - b.distance_km;
    }
    const aDistrictMatch = a.district === farmDoc.location_name ? -1 : 1;
    const bDistrictMatch = b.district === farmDoc.location_name ? -1 : 1;
    return aDistrictMatch - bDistrictMatch;
  });

  return {
    fpos: fposWithDistance,
    data_status: 'official'
  };
};
