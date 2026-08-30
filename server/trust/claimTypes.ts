import { z } from 'zod';
import { 
  ClaimTypeSchema, 
  AuthorityLevelSchema, 
  EvidenceStatusSchema, 
  TruthVerdictSchema 
} from '../../shared/types/trust';

export const AgentExtractedClaimSchema = z.object({
  claim_type: ClaimTypeSchema,
  subject: z.string().nullable().transform(v => v || 'unknown'),
  predicate: z.string().nullable().transform(v => v || 'unknown'),
  value: z.string().nullable().transform(v => v || 'unknown'),
  location: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  normalized_claim: z.string().nullable().transform(v => v || 'unknown')
});

export type AgentExtractedClaim = z.infer<typeof AgentExtractedClaimSchema>;

export const AgentEvidenceSchema = z.object({
  source_name: z.string(),
  source_url: z.string().url(),
  authority_level: AuthorityLevelSchema,
  evidence_excerpt: z.string(),
  supports_claim: z.boolean(),
  contradicts_claim: z.boolean(),
  evidence_status: EvidenceStatusSchema
});

export type AgentEvidence = z.infer<typeof AgentEvidenceSchema>;

export const SourceVerificationResultSchema = z.object({
  source_quality: z.enum(['HIGH', 'MEDIUM', 'LOW', 'UNKNOWN']),
  authority_level: AuthorityLevelSchema,
  freshness: z.enum(['CURRENT', 'STALE', 'UNKNOWN']),
  reason: z.string(),
  confidence: z.number().min(0).max(1)
});

export type SourceVerificationResult = z.infer<typeof SourceVerificationResultSchema>;
