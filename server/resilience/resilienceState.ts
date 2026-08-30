export type SystemState = 
  | 'HEALTHY'
  | 'DEGRADED'
  | 'BLACKOUT'
  | 'RECOVERING'
  | 'RECOVERY_MODE'
  | 'RESTORING'
  | 'SYNCING'
  | 'VERIFYING';

export interface ReconstructedState {
  users: Map<string, any>;
  farms: Map<string, any>;
  farm_crops: Map<string, any>;
  soil_readings: Map<string, any>;
  crop_health: Map<string, any>;
  advisories: Map<string, any>;
  fpos: Map<string, any>;
}

class ResilienceState {
  private currentState: SystemState = 'HEALTHY';
  private simulatedBlackout: boolean = false;
  private recoveredState: ReconstructedState | null = null;
  private consecutiveFailures: number = 0;
  private lastSuccessfulCheck: Date = new Date();

  getState(): SystemState {
    return this.currentState;
  }

  setState(newState: SystemState) {
    if (this.currentState !== newState) {
      console.log(`[RESILIENCE] ${this.currentState} → ${newState}`);
      this.currentState = newState;
    }
  }

  isBlackout(): boolean {
    return this.currentState === 'BLACKOUT' || 
           this.currentState === 'RECOVERING' || 
           this.currentState === 'RECOVERY_MODE' || 
           this.simulatedBlackout;
  }

  isSimulatedBlackout(): boolean {
    return this.simulatedBlackout;
  }

  setSimulatedBlackout(val: boolean) {
    this.simulatedBlackout = val;
    if (val && this.currentState === 'HEALTHY') {
      this.setState('BLACKOUT');
    } else if (!val && this.isBlackout()) {
      // Allow manual toggle back
      this.setState('HEALTHY');
    }
  }

  getConsecutiveFailures(): number {
    return this.consecutiveFailures;
  }

  incrementFailures() {
    this.consecutiveFailures++;
  }

  resetFailures() {
    this.consecutiveFailures = 0;
    this.lastSuccessfulCheck = new Date();
  }

  getLastSuccessfulCheck(): Date {
    return this.lastSuccessfulCheck;
  }

  getRecoveredState(): ReconstructedState | null {
    return this.recoveredState;
  }

  setRecoveredState(state: ReconstructedState | null) {
    this.recoveredState = state;
  }
}

export const resilienceState = new ResilienceState();
