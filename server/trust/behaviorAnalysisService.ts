import { TrustClaim } from '../models/TrustClaim';

export interface BehaviorAnalysisResult {
  propagation_risk: number; // 0-100
  coordination_risk: number; // 0-100
  integrity_risk: number; // 0-100
  total_submissions: number;
}

export const analyzeBehavior = async (claimFingerprint: string): Promise<BehaviorAnalysisResult> => {
  // Count how many times this exact claim has been submitted
  const total_submissions = await TrustClaim.countDocuments({ claim_fingerprint: claimFingerprint });

  // 1. Propagation Risk (Volume)
  // Low: 1-2, Medium: 3-10, High: >10
  let propagation_risk = 0;
  if (total_submissions > 20) propagation_risk = 95;
  else if (total_submissions > 10) propagation_risk = 80;
  else if (total_submissions > 5) propagation_risk = 50;
  else if (total_submissions > 2) propagation_risk = 25;

  // 2. Coordination Risk (Burstiness)
  // For the hackathon, we simulate a check for burst submissions.
  // In a real system, we would group by created_at in 1-hour windows.
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recent_submissions = await TrustClaim.countDocuments({ 
    claim_fingerprint: claimFingerprint,
    created_at: { $gte: oneHourAgo }
  });

  let coordination_risk = 0;
  // If a huge chunk of total submissions happened in the last hour, it's a coordinated burst.
  if (recent_submissions > 10 && recent_submissions / Math.max(total_submissions, 1) > 0.8) {
    coordination_risk = 90; // High burst
  } else if (recent_submissions > 5) {
    coordination_risk = 50;
  }

  // 3. Integrity Risk
  // A combined metric. If coordination is high, integrity risk is high.
  const integrity_risk = Math.max(propagation_risk * 0.4 + coordination_risk * 0.6);

  return {
    propagation_risk: Math.min(Math.round(propagation_risk), 100),
    coordination_risk: Math.min(Math.round(coordination_risk), 100),
    integrity_risk: Math.min(Math.round(integrity_risk), 100),
    total_submissions
  };
};
