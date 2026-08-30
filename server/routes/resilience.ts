import { Router } from 'express';
import { resilienceState } from '../resilience/resilienceState';
import { createSnapshot } from '../resilience/snapshotService';
import { recoverState, syncPendingEvents } from '../resilience/recoveryManager';
import { getEventsSince } from '../resilience/eventLogService';
import fs from 'fs/promises';
import path from 'path';

const router = Router();

// Used by the Frontend Resilience Context
router.get('/status', async (req, res) => {
  const events = await getEventsSince(0);
  res.json({
    state: resilienceState.getState(),
    primary_db: resilienceState.isSimulatedBlackout() ? 'OFFLINE' : (resilienceState.getState() === 'HEALTHY' ? 'ONLINE' : 'DEGRADED'),
    recovery_mode: resilienceState.isBlackout(),
    last_successful_check: resilienceState.getLastSuccessfulCheck(),
    consecutive_failures: resilienceState.getConsecutiveFailures(),
    events_count: events.length,
    pending_events_count: events.filter(e => e.status === 'PENDING_RECOVERY_SYNC').length
  });
});

// Protect these with authentication and environment flags in production
router.post('/simulate-blackout', async (req, res) => {
  console.log('[RESILIENCE] 💥 SIMULATE DATABASE FAILURE REQUESTED');
  resilienceState.setSimulatedBlackout(true);
  res.json({ success: true, message: 'Database failure simulated.' });
});

router.post('/restore', async (req, res) => {
  console.log('[RESILIENCE] 🔄 RESTORE DATABASE REQUESTED');
  resilienceState.setSimulatedBlackout(false);
  // Force a sync immediately
  await syncPendingEvents();
  res.json({ success: true, message: 'Database restore initiated.' });
});

router.post('/create-snapshot', async (req, res) => {
  try {
    const events = await getEventsSince(0);
    const snapshot = await createSnapshot(events.length > 0 ? events[events.length - 1].sequence : 0);
    res.json({ success: true, snapshot_id: snapshot.snapshot_id });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to create snapshot' });
  }
});

router.post('/corrupt-snapshot', async (req, res) => {
  try {
    const SNAPSHOTS_DIR = path.join(process.cwd(), 'recovery', 'snapshots');
    const files = await fs.readdir(SNAPSHOTS_DIR);
    const snapshotFiles = files.filter(f => f.startsWith('snapshot-') && f.endsWith('.json')).sort().reverse();
    
    if (snapshotFiles.length > 0) {
      const target = path.join(SNAPSHOTS_DIR, snapshotFiles[0]);
      const dataStr = await fs.readFile(target, 'utf-8');
      const snapshot = JSON.parse(dataStr);
      
      // Corrupt it by modifying a collection silently without rehashing
      if (snapshot.collections.farms) {
        snapshot.collections.farms.push({ _id: 'corrupted', name: 'CORRUPTED FARM' });
      }
      
      await fs.writeFile(target, JSON.stringify(snapshot, null, 2));
      console.log(`[RESILIENCE] Corrupted snapshot ${snapshotFiles[0]} successfully.`);
      res.json({ success: true, message: `Snapshot ${snapshotFiles[0]} corrupted.` });
    } else {
      res.status(400).json({ success: false, error: 'No snapshots available to corrupt.' });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to corrupt snapshot' });
  }
});

export default router;
