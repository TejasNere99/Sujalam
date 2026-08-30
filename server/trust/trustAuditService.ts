import crypto from 'crypto';
import { TrustClaim } from '../models/TrustClaim';
import { TrustEvidence } from '../models/TrustEvidence';
import { TrustAuditLog } from '../models/TrustAuditLog';
import { AgentExtractedClaim } from './claimTypes';
import { ProcessedEvidence } from './contradictionService';
import { BehaviorAnalysisResult } from './behaviorAnalysisService';
import { VerdictResult } from './truthVerdictService';
import { resilienceState } from '../resilience/resilienceState';
import { appendEvent } from '../resilience/eventLogService';
import mongoose from 'mongoose';

export const saveTrustVerification = async (
  rawMessage: string,
  claim: AgentExtractedClaim & { claim_fingerprint: string },
  evidence: ProcessedEvidence[],
  behavior: BehaviorAnalysisResult,
  scores: { truth_score: number, safety_risk: number },
  verdictResult: VerdictResult,
  aiMetadata: any
) => {
  const input_hash = crypto.createHash('sha256').update(rawMessage).digest('hex');
  const claim_cluster_id = claim.claim_fingerprint; // For now, 1:1 mapping

  const payload = {
    claim,
    evidence,
    behavior,
    scores,
    verdictResult,
    input_hash,
    aiMetadata
  };

  if (resilienceState.isBlackout()) {
    // If DB is down, write to the append-only event log
    await appendEvent(
      'TRUST_VERIFICATION',
      'TrustAuditLog',
      crypto.randomUUID(),
      'system', // No farm ID inherently tied to a general verification yet
      'system',
      payload,
      'PENDING_RECOVERY_SYNC'
    );
    return { audit_id: 'pending-recovery' };
  }

  // Database is HEALTHY
  // 1. Save or Update Claim
  let dbClaim = await TrustClaim.findOne({ claim_fingerprint: claim.claim_fingerprint });
  if (!dbClaim) {
    dbClaim = new TrustClaim({
      claim_type: claim.claim_type,
      subject: claim.subject,
      predicate: claim.predicate,
      value: claim.value,
      raw_text: rawMessage,
      normalized_claim: claim.normalized_claim,
      claim_fingerprint: claim.claim_fingerprint,
      claim_cluster_id
    });
    await dbClaim.save();
  }

  // 2. Save Evidence
  const evidencePromises = evidence.map(ev => {
    return new TrustEvidence({
      claim_id: dbClaim!._id,
      source_name: ev.source_name,
      source_url: ev.source_url,
      authority_level: ev.authority_level,
      retrieved_at: ev.retrieved_at,
      content_hash: ev.content_hash,
      evidence_excerpt: ev.evidence_excerpt,
      supports_claim: ev.supports_claim,
      contradicts_claim: ev.contradicts_claim,
      evidence_status: ev.evidence_status
    }).save();
  });
  await Promise.all(evidencePromises);

  // 3. Save Audit Log
  const audit = new TrustAuditLog({
    claim_id: dbClaim._id,
    input_hash,
    verdict: verdictResult.verdict,
    truth_score: scores.truth_score,
    integrity_risk: behavior.integrity_risk,
    propagation_risk: behavior.propagation_risk,
    coordination_risk: behavior.coordination_risk,
    safety_risk: scores.safety_risk,
    human_review_required: verdictResult.human_review_required,
    evidence_count: evidence.length,
    contradiction_count: evidence.filter(e => e.contradicts_claim).length,
    processing_metadata: aiMetadata
  });
  await audit.save();

  return { audit_id: audit._id.toString(), claim_id: dbClaim._id.toString() };
};
