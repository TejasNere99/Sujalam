# Sujalam 2.0 Blackout Resilience System

## Problem
The hackathon challenge presented a scenario where the primary MongoDB database becomes suddenly corrupted or unavailable while farmers are actively using the application. Normal web applications would immediately return 500 errors and become unusable. 

## Architecture
Sujalam implements a state machine-driven **Resilience Layer** that intercepts service-level logic.
Instead of directly binding all frontend requests to Mongoose queries, the system acts conditionally based on the `resilienceState` (HEALTHY, DEGRADED, BLACKOUT, RECOVERY_MODE).

1. **Health Monitoring**: `healthMonitor.ts` periodically pings the MongoDB admin interface. 3 consecutive failures trigger `BLACKOUT`.
2. **Snapshot Strategy**: `snapshotService.ts` periodically takes JSON dumps of the core data models (Farm, User, Advisory, etc.) and hashes them via SHA-256 to ensure integrity.
3. **Event Log**: `eventLogService.ts` maintains an append-only JSONL event history (with SHA-256 chaining) to track everything that happened *since* the last snapshot.

## Recovery Mode
When `BLACKOUT` is detected:
1. The `recoveryManager` loads the latest snapshot, verifying its SHA-256 hash. (If corrupted, it safely falls back to the previous snapshot).
2. It replays the valid event chain from the log on top of the snapshot to build a reconstructed in-memory `FarmState`.
3. The system enters `RECOVERY_MODE`.

## In-Flight Operations
During `RECOVERY_MODE`, all writes (e.g. asking for a new AI Advisory, or logging a CropHealth image) are intercepted.
Instead of being sent to MongoDB, they are appended to the local `event.log` as `PENDING_RECOVERY_SYNC` events, and the in-memory reconstructed state is updated. 

The farmer experiences **zero downtime**. The AI continues operating using the reconstructed state as its context. The AI Safety Validator remains completely intact.

## Restoration
When the database is restored (via the `/api/resilience/restore` endpoint):
1. All pending events in the log are queried.
2. They are replayed into MongoDB (upserting).
3. Statuses are marked as `SYNCED`.
4. The system seamlessly transitions back to `HEALTHY`.
