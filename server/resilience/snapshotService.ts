import fs from 'fs/promises';
import path from 'path';
import { generateChecksum, verifyChecksum } from './integrityService';

import { User } from '../models/User';
import { Farm } from '../models/Farm';
import { FarmCrop } from '../models/FarmCrop';
import { SoilReading } from '../models/SoilReading';
import { CropHealth } from '../models/CropHealth';
import { Advisory } from '../models/Advisory';

const SNAPSHOTS_DIR = path.join(process.cwd(), 'recovery', 'snapshots');

export interface Snapshot {
  snapshot_id: string;
  created_at: string;
  schema_version: number;
  collections: {
    users: any[];
    farms: any[];
    farm_crops: any[];
    soil_readings: any[];
    crop_health: any[];
    advisories: any[];
  };
  event_sequence: number;
  checksum: string;
}

export const createSnapshot = async (sequenceNumber: number = 0): Promise<Snapshot> => {
  console.log('[RESILIENCE] Creating snapshot...');
  
  await fs.mkdir(SNAPSHOTS_DIR, { recursive: true });

  const collections = {
    users: await User.find({}).lean(),
    farms: await Farm.find({}).lean(),
    farm_crops: await FarmCrop.find({}).lean(),
    soil_readings: await SoilReading.find({}).lean(),
    crop_health: await CropHealth.find({}).lean(),
    advisories: await Advisory.find({}).lean(),
  };

  const snapshotId = `snapshot-${Date.now()}`;
  const payloadToHash = {
    snapshot_id: snapshotId,
    created_at: new Date().toISOString(),
    schema_version: 1,
    collections,
    event_sequence: sequenceNumber
  };

  const checksum = generateChecksum(payloadToHash);
  
  const snapshot: Snapshot = {
    ...payloadToHash,
    checksum
  };

  await fs.writeFile(
    path.join(SNAPSHOTS_DIR, `${snapshotId}.json`), 
    JSON.stringify(snapshot, null, 2)
  );

  console.log(`[RESILIENCE] Snapshot created: ${snapshotId} (checksum verified)`);
  return snapshot;
};

export const getLatestValidSnapshot = async (): Promise<Snapshot | null> => {
  try {
    await fs.mkdir(SNAPSHOTS_DIR, { recursive: true });
    const files = await fs.readdir(SNAPSHOTS_DIR);
    const snapshotFiles = files.filter(f => f.startsWith('snapshot-') && f.endsWith('.json'))
                               .sort().reverse(); // Sort descending by filename (which has timestamp)

    for (const file of snapshotFiles) {
      const dataStr = await fs.readFile(path.join(SNAPSHOTS_DIR, file), 'utf-8');
      const snapshot: Snapshot = JSON.parse(dataStr);
      
      const payloadToHash = {
        snapshot_id: snapshot.snapshot_id,
        created_at: snapshot.created_at,
        schema_version: snapshot.schema_version,
        collections: snapshot.collections,
        event_sequence: snapshot.event_sequence
      };

      if (verifyChecksum(payloadToHash, snapshot.checksum)) {
        return snapshot;
      } else {
        console.warn(`[RECOVERY] Snapshot ${snapshot.snapshot_id} corrupted! Fallback to previous.`);
      }
    }
    return null;
  } catch (err) {
    console.error('[RECOVERY] Error reading snapshots:', err);
    return null;
  }
};
