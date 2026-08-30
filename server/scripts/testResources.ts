import { resourceAvailabilityService } from '../services/resourceAvailabilityService';
import { resourceMatchingService } from '../services/resourceMatchingService';
import { validateResourceRecommendation } from '../decision/resourceSafetyValidator';

async function testResources() {
  console.log('Running Resource Intelligence Tests...');
  
  // 1. Test deterministic matching
  const matches = await resourceMatchingService.findMatches({
    longitude: 77.1025,
    latitude: 28.7041,
    operation: 'IRRIGATION', // should map to PUMP
    requiredDate: new Date()
  });
  
  console.log(`[TEST 1] Found ${matches.machinery.length} pumps`);

  // 2. Test AI Safety Validator (Hallucination block)
  const context = {
    farmer: { id: 'test' },
    farm: { id: 'test', name: 'test' },
    crop: null, soil: null, weather: null, crop_health: null, market: null, schemes: [], fpos: [],
    resource_context: {
      requested_operation: 'IRRIGATION',
      requiredDate: new Date().toISOString(),
      labour_matches: matches.labour,
      machinery_matches: matches.machinery
    }
  };

  const aiResult = {
    status: 'success' as const,
    data: {
      agent: 'resource' as const,
      action: 'BOOK' as const,
      recommended_option: {
        resource_ids: ['FAKE-ID-999'], // Hallucinated ID
        reason: 'Because I made it up',
        estimated_cost: 500,
        estimated_distance_km: 1
      },
      urgency: 'HIGH' as const,
      confidence: 0.9
    }
  };

  const validated = validateResourceRecommendation(context, aiResult);
  console.log(`[TEST 2] Safety Validator blocked hallucination: ${validated.action === 'NO_MATCH'}`);

  console.log('All tests completed.');
  process.exit(0);
}

// We don't connect to DB here because we want a dry-run or we can connect to DB if needed
// Actually, findMatches hits DB, so we need DB connection.

import { connectMongoDB } from '../lib/mongodb';
connectMongoDB().then(() => {
  testResources().catch(console.error);
});
