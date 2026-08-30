import mongoose from 'mongoose';
import { resilienceState } from './resilienceState';
import { recoverState, syncPendingEvents } from './recoveryManager';

const HEALTH_CHECK_INTERVAL = 5000; // 5 seconds
const BLACKOUT_THRESHOLD = 3;

export const checkDatabaseHealth = async () => {
  if (resilienceState.isSimulatedBlackout()) {
    handleFailure();
    return;
  }

  try {
    // Lightweight read to verify Mongo is up
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Mongoose not connected');
    }
    
    handleSuccess();
  } catch (error) {
    handleFailure();
  }
};

const handleSuccess = () => {
  if (resilienceState.getState() === 'RECOVERING' || resilienceState.getState() === 'RECOVERY_MODE') {
    // Database came back! We need to sync.
    resilienceState.setState('RESTORING');
    syncPendingEvents().catch(console.error);
    return;
  }
  
  if (resilienceState.getState() !== 'HEALTHY') {
    resilienceState.setState('HEALTHY');
  }
  resilienceState.resetFailures();
};

const handleFailure = () => {
  const currentState = resilienceState.getState();
  
  if (currentState === 'RECOVERING' || currentState === 'RECOVERY_MODE') {
    // Already in blackout, do nothing
    return;
  }

  resilienceState.incrementFailures();
  const failures = resilienceState.getConsecutiveFailures();

  if (failures >= BLACKOUT_THRESHOLD) {
    if (currentState !== 'BLACKOUT') {
      resilienceState.setState('BLACKOUT');
      console.error('[RESILIENCE] BLACKOUT DETECTED. Threshold reached.');
      // Trigger recovery mode
      recoverState().catch(console.error);
    }
  } else {
    resilienceState.setState('DEGRADED');
    console.warn(`[RESILIENCE] DB health check failed. (${failures}/${BLACKOUT_THRESHOLD})`);
  }
};

export const startHealthMonitor = () => {
  console.log('[RESILIENCE] Starting health monitor...');
  setInterval(checkDatabaseHealth, HEALTH_CHECK_INTERVAL);
};
