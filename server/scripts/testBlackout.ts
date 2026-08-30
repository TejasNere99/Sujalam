import mongoose from 'mongoose';
import { connectMongoDB } from '../lib/mongodb';
import { resilienceState } from '../resilience/resilienceState';
import { createSnapshot, getLatestValidSnapshot } from '../resilience/snapshotService';
import { recoverState, syncPendingEvents } from '../resilience/recoveryManager';
import { getEventsSince, appendEvent } from '../resilience/eventLogService';
import { checkDatabaseHealth } from '../resilience/healthMonitor';

import { getFarmsByUser, createFarm } from '../services/farmService';
import { getLatestAdvisory, refreshFarmAdvisory } from '../services/advisoryService';
import { createCrop } from '../services/cropService';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
};

async function runTests() {
  console.log('=== BLACKOUT RESILIENCE TESTS ===');
  await connectMongoDB();
  const testUserId = new mongoose.Types.ObjectId().toString();

  console.log('\n--- TEST 1: Healthy DB ---');
  resilienceState.setState('HEALTHY');
  await checkDatabaseHealth();
  assert(resilienceState.getState() === 'HEALTHY', 'Should remain healthy');
  
  // Create a base farm to work with
  const farm = await createFarm(testUserId, { name: 'Resilience Test Farm', area_acres: 5 });
  console.log('Created test farm:', farm.id);

  console.log('\n--- TEST 2: Snapshot Creation ---');
  const snap = await createSnapshot(0);
  assert(!!snap.checksum, 'Snapshot should have checksum');
  console.log('Snapshot generated with ID:', snap.snapshot_id);

  console.log('\n--- TEST 3: Health Threshold Degradation ---');
  resilienceState.setSimulatedBlackout(true);
  await checkDatabaseHealth();
  assert(resilienceState.getState() === 'DEGRADED', 'Should degrade on 1st fail');
  await checkDatabaseHealth();
  assert(resilienceState.getState() === 'DEGRADED', 'Should degrade on 2nd fail');

  console.log('\n--- TEST 4: Blackout Detection & Recovery Mode ---');
  await checkDatabaseHealth();
  // Recovery is async in healthMonitor
  await delay(1000); 
  assert(resilienceState.isBlackout(), 'Should enter blackout on 3rd fail');
  assert(resilienceState.getState() === 'RECOVERY_MODE', 'Should automatically recover state');

  console.log('\n--- TEST 5: Action During Blackout (Farm Read) ---');
  const farms = await getFarmsByUser(testUserId);
  assert(farms.length > 0, 'Should read from reconstructed state');
  console.log('Read farms from memory during blackout:', farms.length);

  console.log('\n--- TEST 6: Action During Blackout (New Crop Write) ---');
  const crop = await createCrop(testUserId, farm.id, { crop_name: 'Cotton', season: 'Kharif', expected_yield_tons: 10 });
  assert(!!crop.id, 'Should create crop in memory');
  console.log('Crop created in memory and queued:', crop.id);

  console.log('\n--- TEST 7: AI Advisory During Blackout ---');
  const advisory = await refreshFarmAdvisory(testUserId, farm.id);
  assert(!!advisory.id, 'Advisory generated');
  assert(advisory.ai_metadata.recovery_mode === true, 'AI Metadata should flag recovery mode');
  console.log('AI Advisory successfully generated during blackout.');

  console.log('\n--- TEST 8: Event Log Verification ---');
  const events = await getEventsSince(0);
  const pending = events.filter(e => e.status === 'PENDING_RECOVERY_SYNC');
  assert(pending.length >= 2, 'Should have pending events');
  console.log(`Pending events found: ${pending.length}`);

  console.log('\n--- TEST 9: Restoration & Sync ---');
  resilienceState.setSimulatedBlackout(false);
  await syncPendingEvents();
  assert(resilienceState.getState() === 'HEALTHY', 'Should return to healthy');
  
  console.log('\n--- TEST 10: Post-Restore DB Verification ---');
  const finalFarms = await getFarmsByUser(testUserId);
  const finalAdv = await getLatestAdvisory(testUserId, farm.id);
  assert(finalFarms.length > 0, 'Farm persisted in MongoDB');
  assert(finalAdv !== null, 'Advisory persisted in MongoDB');
  console.assert(finalAdv?.ai_metadata.recovery_mode === true, 'Advisory metadata preserved in MongoDB');
  console.log('Verified data in MongoDB after restore.');

  console.log('\n=== TESTS PASSED SUCCESSFULLY ===');
  process.exit(0);
}

runTests().catch(e => {
  console.error('TEST FAILED:', e);
  process.exit(1);
});
