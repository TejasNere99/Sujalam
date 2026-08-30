import { getAIProvider } from '../integrations/ai/aiFactory';
import { AgentExtractedClaimSchema, AgentExtractedClaim } from './claimTypes';
import crypto from 'crypto';

const SYSTEM_PROMPT = `
You are an expert agricultural claim extraction agent for Sujalam TruthGuard.
Your job is to read raw user messages (which may be WhatsApp forwards, complaints, or questions) and extract the core factual claim being made.

Extract the claim into the requested JSON schema.
- 'claim_type': Must be one of SCHEME, CROP_DISEASE, TREATMENT, WEATHER, MARKET, FPO, GENERAL_AGRICULTURE, FARM_REPORT, UNKNOWN.
- 'subject': What is the claim about? (e.g. "PM KISAN", "Onion Downy Mildew", "Chemical X"). Keep it concise.
- 'predicate': What action or property is being claimed? (e.g. "is fake", "cures disease", "price dropped"). Keep it concise.
- 'value': The core truth value or specific metric claimed.
- 'location': Any specific region mentioned.
- 'language': The original language (e.g., 'en', 'hi').
- 'normalized_claim': A standardized, canonical English representation of the claim. (e.g. "PM-KISAN scheme is cancelled.")

IMPORTANT: Do not verify the claim. Just extract what the user is asserting.
`;

export const extractClaim = async (rawMessage: string): Promise<AgentExtractedClaim & { claim_fingerprint: string }> => {
  const provider = getAIProvider();
  
  const response = await provider.generateStructuredResponse(
    SYSTEM_PROMPT,
    `Extract the claim from this message:\n\n"${rawMessage}"`,
    AgentExtractedClaimSchema
  );

  if (!response.data) {
    throw new Error('Failed to extract claim: ' + response.error);
  }

  const claimData = response.data;
  
  // Create canonical fingerprint
  const fingerprintString = `${claimData.subject}|${claimData.predicate}|${claimData.value}|${claimData.location || ''}`.toLowerCase().trim();
  const claim_fingerprint = crypto.createHash('sha256').update(fingerprintString).digest('hex');

  return {
    ...claimData,
    claim_fingerprint
  };
};
