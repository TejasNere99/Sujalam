import { AgentExtractedClaim } from './claimTypes';
import { EvidenceRecord } from './evidenceService';
import { analyzeContradiction } from '../agents/truth/contradictionAgent';
import { ITrustEvidence, TrustEvidence } from '../models/TrustEvidence';

export interface ProcessedEvidence {
  source_name: string;
  source_url: string;
  authority_level: string;
  retrieved_at: Date;
  content_hash: string;
  evidence_excerpt: string;
  supports_claim: boolean;
  contradicts_claim: boolean;
  evidence_status: string;
}

export const processEvidenceContradictions = async (
  claim: AgentExtractedClaim,
  retrievedDocs: EvidenceRecord[]
): Promise<ProcessedEvidence[]> => {
  if (!retrievedDocs || retrievedDocs.length === 0) {
    return [];
  }

  // Use Promise.allSettled to process each document independently.
  const promises = retrievedDocs.map(doc => analyzeContradiction(claim, doc.raw_content));
  const results = await Promise.allSettled(promises);

  const processed: ProcessedEvidence[] = [];

  results.forEach((res, index) => {
    if (res.status === 'fulfilled') {
      processed.push({
        ...retrievedDocs[index],
        evidence_excerpt: res.value.evidence_excerpt,
        supports_claim: res.value.supports_claim,
        contradicts_claim: res.value.contradicts_claim,
        evidence_status: res.value.evidence_status
      });
    } else {
      console.error(`Failed to analyze contradiction for source ${retrievedDocs[index].source_url}:`, res.reason);
      // Fallback
      processed.push({
        ...retrievedDocs[index],
        evidence_excerpt: 'Failed to analyze this evidence programmatically.',
        supports_claim: false,
        contradicts_claim: false,
        evidence_status: 'INSUFFICIENT_EVIDENCE'
      });
    }
  });

  return processed;
};
