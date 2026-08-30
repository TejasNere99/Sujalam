import { resilienceState, ReconstructedState } from './resilienceState';
import { getLatestValidSnapshot } from './snapshotService';
import { getEventsSince, updateEventStatus } from './eventLogService';

import { User } from '../models/User';
import { Farm } from '../models/Farm';
import { FarmCrop } from '../models/FarmCrop';
import { SoilReading } from '../models/SoilReading';
import { CropHealth } from '../models/CropHealth';
import { Advisory } from '../models/Advisory';

export const recoverState = async () => {
  console.log('[RECOVERY] Loading snapshot...');
  const snapshot = await getLatestValidSnapshot();

  if (!snapshot) {
    console.error('[RECOVERY] No valid snapshot found! Cannot reconstruct state.');
    return;
  }

  console.log(`[RECOVERY] Snapshot checksum verified. (ID: ${snapshot.snapshot_id})`);

  const state: ReconstructedState = {
    users: new Map(snapshot.collections.users.map(u => [u._id.toString(), u])),
    farms: new Map(snapshot.collections.farms.map(f => [f._id.toString(), f])),
    farm_crops: new Map(snapshot.collections.farm_crops.map(c => [c._id.toString(), c])),
    soil_readings: new Map(snapshot.collections.soil_readings.map(s => [s._id.toString(), s])),
    crop_health: new Map(snapshot.collections.crop_health.map(h => [h._id.toString(), h])),
    advisories: new Map(snapshot.collections.advisories.map(a => [a._id.toString(), a])),
    fpos: new Map() // FPOs are read-only, assuming they don't change during blackout for this demo
  };

  console.log('[RECOVERY] Loading events...');
  const events = await getEventsSince(snapshot.event_sequence);

  for (const event of events) {
    console.log(`[RECOVERY] Replaying event: ${event.event_type} (${event.event_id})`);
    
    // Simple state machine replayer
    if (event.event_type === 'FARM_CREATED' || event.event_type === 'FARM_UPDATED') {
      state.farms.set(event.entity_id, event.payload);
    } else if (event.event_type === 'ADVISORY_CREATED') {
      state.advisories.set(event.entity_id, event.payload);
    } else if (event.event_type === 'CROP_CREATED' || event.event_type === 'CROP_UPDATED') {
      state.farm_crops.set(event.entity_id, event.payload);
    } else if (event.event_type === 'SOIL_READING_CREATED') {
      state.soil_readings.set(event.entity_id, event.payload);
    } else if (event.event_type === 'CROP_HEALTH_CREATED') {
      state.crop_health.set(event.entity_id, event.payload);
    }
  }

  console.log(`[RECOVERY] Recovery state reconstructed. (Events replayed: ${events.length})`);
  resilienceState.setRecoveredState(state);
  resilienceState.setState('RECOVERY_MODE');
};

export const syncPendingEvents = async () => {
  console.log('[SYNC] Applying pending events...');
  // Find all events from 0 that are PENDING
  const events = await getEventsSince(0);
  const pendingEvents = events.filter(e => e.status === 'PENDING_RECOVERY_SYNC');

  if (pendingEvents.length === 0) {
    console.log('[SYNC] Database synchronized. No pending events.');
    resilienceState.setState('HEALTHY');
    return;
  }

  let syncedCount = 0;

  for (const event of pendingEvents) {
    try {
      if (event.event_type === 'FARM_CREATED') {
        const doc = await Farm.findById(event.entity_id);
        if (!doc) await Farm.create({ ...event.payload, _id: event.entity_id });
      } else if (event.event_type === 'FARM_UPDATED') {
        await Farm.findByIdAndUpdate(event.entity_id, event.payload, { upsert: true });
      } else if (event.event_type === 'ADVISORY_CREATED') {
        const doc = await Advisory.findById(event.entity_id);
        if (!doc) await Advisory.create({ ...event.payload, _id: event.entity_id });
      } else if (event.event_type === 'CROP_CREATED' || event.event_type === 'CROP_UPDATED') {
        await FarmCrop.findByIdAndUpdate(event.entity_id, event.payload, { upsert: true });
      } else if (event.event_type === 'SOIL_READING_CREATED') {
        await SoilReading.findByIdAndUpdate(event.entity_id, event.payload, { upsert: true });
      } else if (event.event_type === 'CROP_HEALTH_CREATED') {
        await CropHealth.findByIdAndUpdate(event.entity_id, event.payload, { upsert: true });
      }

      await updateEventStatus(event.event_id, 'SYNCED');
      syncedCount++;
    } catch (e) {
      console.error(`[SYNC] Failed to sync event ${event.event_id}:`, e);
    }
  }

  console.log(`[SYNC] Database synchronized. ${syncedCount} / ${pendingEvents.length} events processed.`);
  resilienceState.setState('HEALTHY');
};
