import { z } from 'zod';

export const ClaimTypeSchema = z.enum([
  'SCHEME',
  'CROP_DISEASE',
  'TREATMENT',
  'WEATHER',
  'MARKET',
  'FPO',
  'GENERAL_AGRICULTURE',
  'FARM_REPORT',
  'UNKNOWN'
]);
export type ClaimType = z.infer<typeof ClaimTypeSchema>;

export const AuthorityLevelSchema = z.enum([
  'LEVEL_1', // Official Government / Primary
  'LEVEL_2', // Recognized Agricultural Institutions / Universities
  'LEVEL_3', // Reputable Secondary
  'LEVEL_4', // Unverified / Unknown
  'LEVEL_5'  // User Generated
]);
export type AuthorityLevel = z.infer<typeof AuthorityLevelSchema>;

export const EvidenceStatusSchema = z.enum([
  'SUPPORTS',
  'CONTRADICTS',
  'MIXED',
  'INSUFFICIENT_EVIDENCE',
  'NO_VERIFIABLE_EVIDENCE'
]);
export type EvidenceStatus = z.infer<typeof EvidenceStatusSchema>;

export const TruthVerdictSchema = z.enum([
  'VERIFIED',
  'LIKELY_TRUE',
  'UNCERTAIN',
  'DISPUTED',
  'FALSE_OR_HIGH_RISK',
  'POTENTIALLY_DANGEROUS'
]);
export type TruthVerdict = z.infer<typeof TruthVerdictSchema>;

export const RiskLevelSchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const TrustClaimPayloadSchema = z.object({
  claim_type: ClaimTypeSchema,
  subject: z.string(),
  predicate: z.string(),
  value: z.string(),
  location: z.string().optional(),
  language: z.string().optional()
});
export type TrustClaimPayload = z.infer<typeof TrustClaimPayloadSchema>;
