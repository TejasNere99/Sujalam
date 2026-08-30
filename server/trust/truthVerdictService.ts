import { ProcessedEvidence } from './contradictionService';
import { TruthScoreResult } from './truthScoringService';
import { TruthVerdict } from '../../shared/types/trust';
import { AgentExtractedClaim } from './claimTypes';

export interface VerdictResult {
  verdict: TruthVerdict;
  human_review_required: boolean;
  explanation: string;
}

export const determineVerdict = (
  claim: AgentExtractedClaim,
  evidenceList: ProcessedEvidence[],
  scores: TruthScoreResult
): VerdictResult => {
  const { truth_score, safety_risk } = scores;

  // 1. Contradiction / Dispute Gate (Takes precedence over general safety gate if authoritative sources literally disagree)
  const hasStrongSupport = evidenceList.some(e => e.supports_claim && ['LEVEL_1', 'LEVEL_2'].includes(e.authority_level));
  const hasStrongContradiction = evidenceList.some(e => e.contradicts_claim && ['LEVEL_1', 'LEVEL_2'].includes(e.authority_level));

  if (hasStrongSupport && hasStrongContradiction) {
    return {
      verdict: 'DISPUTED',
      human_review_required: true,
      explanation: "Reliable authoritative sources disagree on this claim."
    };
  }

  // 2. Treatment Safety Gate
  if (claim.claim_type === 'TREATMENT' || claim.claim_type === 'CROP_DISEASE') {
    if (safety_risk >= 80) {
      return {
        verdict: 'POTENTIALLY_DANGEROUS',
        human_review_required: true,
        explanation: evidenceList.some(e => e.contradicts_claim)
          ? "Authoritative agricultural sources contradict this treatment. Do NOT apply it."
          : "This treatment could not be verified from an authoritative agricultural source. Do not apply it based only on this forwarded message."
      };
    }
  }

  // 3. No Evidence Gate
  if (evidenceList.length === 0 || evidenceList.every(e => e.evidence_status === 'INSUFFICIENT_EVIDENCE')) {
    return {
      verdict: 'UNCERTAIN',
      human_review_required: claim.claim_type === 'SCHEME' || claim.claim_type === 'MARKET',
      explanation: "We could not find enough authoritative evidence to verify this claim."
    };
  }

  // 4. Scoring Gates
  if (truth_score >= 80) {
    return {
      verdict: 'VERIFIED',
      human_review_required: false,
      explanation: "This information is supported by an official or authoritative source."
    };
  } else if (truth_score >= 60) {
    return {
      verdict: 'LIKELY_TRUE',
      human_review_required: false,
      explanation: "This appears supported, but evidence is not completely conclusive."
    };
  } else if (truth_score >= 40) {
    return {
      verdict: 'UNCERTAIN',
      human_review_required: false,
      explanation: "Evidence is mixed or insufficient to confirm this claim."
    };
  } else {
    return {
      verdict: 'FALSE_OR_HIGH_RISK',
      human_review_required: false,
      explanation: "Authoritative government or agricultural information contradicts this claim."
    };
  }
};
