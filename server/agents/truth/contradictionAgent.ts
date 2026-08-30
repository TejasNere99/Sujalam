import { getAIProvider } from '../../integrations/ai/aiFactory';
import { AgentExtractedClaim } from '../../trust/claimTypes';
import { EvidenceStatusSchema, EvidenceStatus } from '../../../shared/types/trust';
import { z } from 'zod';

const ContradictionAnalysisSchema = z.object({
  evidence_excerpt: z.string(),
  supports_claim: z.boolean(),
  contradicts_claim: z.boolean(),
  evidence_status: EvidenceStatusSchema,
  reasoning: z.string().nullable().optional().transform(v => v || 'No reasoning provided')
});

const SYSTEM_PROMPT = `
You are an Evidence Contradiction Analyst for Sujalam TruthGuard.
You will be provided with a specific agricultural claim and a piece of retrieved source evidence.
Your task is to determine the relationship between the claim and the evidence.

RULES:
- If the evidence clearly proves the claim is TRUE, set supports_claim=true, contradicts_claim=false, evidence_status='SUPPORTS'.
- If the evidence clearly proves the claim is FALSE, set supports_claim=false, contradicts_claim=true, evidence_status='CONTRADICTS'.
- If the evidence has elements of both, set evidence_status='MIXED'.
- If the evidence is completely irrelevant or does not contain enough information to verify the claim, set evidence_status='INSUFFICIENT_EVIDENCE' (with supports=false, contradicts=false).

Extract a concise 1-2 sentence evidence_excerpt from the source text that best justifies your conclusion.
Do NOT use external knowledge. Only use the provided evidence text.
`;

export const analyzeContradiction = async (
  claim: AgentExtractedClaim,
  evidenceText: string
): Promise<z.infer<typeof ContradictionAnalysisSchema>> => {
  const provider = getAIProvider();
  
  const userPrompt = `
CLAIM:
Subject: ${claim.subject}
Predicate: ${claim.predicate}
Value: ${claim.value}

EVIDENCE TEXT:
"${evidenceText}"

Analyze this evidence against the claim.
  `;

  const response = await provider.generateStructuredResponse(
    SYSTEM_PROMPT,
    userPrompt,
    ContradictionAnalysisSchema
  );

  if (!response.data) {
    throw new Error('Failed to analyze contradiction: ' + response.error);
  }

  return response.data;
};
