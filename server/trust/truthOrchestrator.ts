import { extractClaim } from './claimExtractor';
import { retrieveEvidenceForClaim } from './evidenceService';
import { processEvidenceContradictions } from './contradictionService';
import { analyzeBehavior } from './behaviorAnalysisService';
import { calculateTruthScore } from './truthScoringService';
import { determineVerdict } from './truthVerdictService';
import { saveTrustVerification } from './trustAuditService';

export const runTruthGuardPipeline = async (rawMessage: string) => {
  const startTime = Date.now();
  let aiMetadata = {
    provider: process.env.AI_PROVIDER || 'mock',
    agents_used: [] as string[],
    fallback: (process.env.AI_PROVIDER || 'mock') === 'mock',
    latency_ms: 0
  };

  try {
    // 1. Extract Claim
    const claim = await extractClaim(rawMessage);
    aiMetadata.agents_used.push('claimExtractor');

    // 2. Parallel Processing: Evidence & Behavior
    const [evidenceResult, behaviorResult] = await Promise.allSettled([
      retrieveEvidenceForClaim(claim.subject, claim.predicate, claim.value),
      analyzeBehavior(claim.claim_fingerprint)
    ]);

    const retrievedEvidence = evidenceResult.status === 'fulfilled' ? evidenceResult.value : [];
    const behavior = behaviorResult.status === 'fulfilled' 
      ? behaviorResult.value 
      : { propagation_risk: 0, coordination_risk: 0, integrity_risk: 0, total_submissions: 1 };

    // 3. Analyze Contradictions
    const processedEvidence = await processEvidenceContradictions(claim, retrievedEvidence);
    if (processedEvidence.length > 0) {
      aiMetadata.agents_used.push('contradictionAgent');
    }

    // 4. Deterministic Scoring
    const scores = calculateTruthScore(processedEvidence, claim.claim_type);

    // 5. Verdict & Safety Gate
    const verdictResult = determineVerdict(claim, processedEvidence, scores);

    aiMetadata.latency_ms = Date.now() - startTime;

    // 6. Audit & Persistence
    const { audit_id } = await saveTrustVerification(
      rawMessage,
      claim,
      processedEvidence,
      behavior,
      scores,
      verdictResult,
      aiMetadata
    );

    // 7. Return Final Truth Payload
    return {
      success: true,
      verdict: verdictResult.verdict,
      truth_score: scores.truth_score,
      integrity_risk: behavior.integrity_risk,
      propagation_risk: behavior.propagation_risk,
      coordination_risk: behavior.coordination_risk,
      safety_risk: scores.safety_risk,
      claim: {
        type: claim.claim_type,
        normalized_claim: claim.normalized_claim,
        claim_fingerprint: claim.claim_fingerprint
      },
      evidence: processedEvidence,
      contradictions: processedEvidence.filter(e => e.contradicts_claim),
      reasons: [verdictResult.explanation],
      human_review_required: verdictResult.human_review_required,
      audit_id,
      ai_metadata: aiMetadata
    };

  } catch (error: any) {
    console.error('[TRUTHGUARD] Pipeline failed:', error);
    
    // SAFE FALLBACK
    return {
      success: false,
      verdict: 'UNCERTAIN',
      truth_score: 0,
      integrity_risk: 0,
      propagation_risk: 0,
      coordination_risk: 0,
      safety_risk: 0,
      claim: null,
      evidence: [],
      contradictions: [],
      reasons: ["TruthGuard pipeline encountered a failure. Cannot safely verify."],
      human_review_required: true,
      audit_id: null,
      ai_metadata: aiMetadata
    };
  }
};
