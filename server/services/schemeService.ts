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

  const DEFAULT_SCHEMES = [
    {
      name: 'PM-KISAN',
      description: 'Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families.',
      eligibility: 'All smallholder and landholding farmers with valid Aadhaar & land records.',
      benefit: '₹6,000 / year direct transfer to bank account',
      action_url: 'https://pmkisan.gov.in',
      region: 'National',
      crop_types: ['All'],
      created_at: new Date()
    },
    {
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      description: 'Comprehensive crop insurance coverage against non-preventable natural risks, pests, and post-harvest losses.',
      eligibility: 'All farmers growing notified food crops, oilseeds, and commercial/horticultural crops.',
      benefit: 'Up to 100% loss coverage with only 1.5% - 2% premium contribution by farmer',
      action_url: 'https://pmfby.gov.in',
      region: 'National',
      crop_types: ['Wheat', 'Rice', 'Cotton', 'Soybean', 'Maize', 'All'],
      created_at: new Date()
    },
    {
      name: 'PM Krishi Sinchayee Yojana (Per Drop More Crop)',
      description: 'Subsidy for installing micro-irrigation systems (drip and sprinkler) to improve water-use efficiency.',
      eligibility: 'Farmers with verified farm land and accessible water source.',
      benefit: '45% to 55% financial subsidy on drip/sprinkler system installation',
      action_url: 'https://pmksy.gov.in',
      region: 'National',
      crop_types: ['All'],
      created_at: new Date()
    },
    {
      name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
      description: 'Financial assistance for procurement of modern agricultural machinery and setting up Custom Hiring Centers.',
      eligibility: 'Individual farmers, women farmers, SC/ST, and Farmer Producer Organisations (FPOs).',
      benefit: '40% to 50% subsidy on tractors, power tillers, rotavators, and sprayers',
      action_url: 'https://agrimachinery.nic.in',
      region: 'National',
      crop_types: ['All'],
      created_at: new Date()
    },
    {
      name: 'PM-KUSUM (Solar Agriculture Pumps)',
      description: 'Subsidies for standalone solar agriculture pumps and solarisation of existing grid-connected agriculture pumps.',
      eligibility: 'Individual farmers, groups of farmers, FPOs, and water user associations.',
      benefit: 'Up to 60% government subsidy on solar pump installation',
      action_url: 'https://pmkusum.mnre.gov.in',
      region: 'National',
      crop_types: ['All'],
      created_at: new Date()
    },
    {
      name: 'Soil Health Card Scheme',
      description: 'Regular soil testing to assess 12 critical soil health parameters and issue crop-specific nutrient advisories.',
      eligibility: 'All farmers nationwide.',
      benefit: 'Free soil testing, customized fertilizer advice & NPK deficiency mapping',
      action_url: 'https://soilhealth.dac.gov.in',
      region: 'National',
      crop_types: ['All'],
      created_at: new Date()
    }
  ];

  let schemes = await Scheme.find(query).limit(10).lean();

  if (schemes.length < 3) {
    // Seed default verified schemes if DB has fewer than 3
    for (const item of DEFAULT_SCHEMES) {
      await Scheme.updateOne(
        { name: item.name },
        { $setOnInsert: item },
        { upsert: true }
      );
    }
    schemes = await Scheme.find(query).limit(10).lean();
  }

  return schemes.map(s => ({ ...s, id: (s as any)._id.toString() }));
};
