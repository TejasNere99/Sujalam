import { Scheme } from '../models/Scheme';
import { assertFarmOwnership } from '../lib/auth';
import { getActiveCrop } from './cropService';

export const getRelevantSchemes = async (userId: string, farmId: string) => {
  const farm = await assertFarmOwnership(userId, farmId);
  const activeCrop = await getActiveCrop(userId, farmId);

  // Simple matching logic
  const query: any = {};
  
  // Match region if farm has location_name
  if (farm.location_name) {
    // Mocking a simple regex search or just grab everything for the demo if none strictly match
  }

  let schemes = await Scheme.find(query).limit(5).lean();

  if (schemes.length === 0) {
    // Insert mock schemes if DB is empty
    const mockScheme = new Scheme({
      name: 'PM-KISAN',
      description: 'Pradhan Mantri Kisan Samman Nidhi',
      eligibility: 'All landholding farmers',
      benefit: '₹6000 per year',
      action_url: 'https://pmkisan.gov.in',
      region: 'National',
      crop_types: ['All'],
      created_at: new Date()
    });
    await mockScheme.save();
    schemes = [mockScheme.toObject()];
  }

  return schemes.map(s => ({ ...s, id: (s as any)._id.toString() }));
};
