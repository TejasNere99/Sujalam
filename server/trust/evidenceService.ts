import crypto from 'crypto';
import { AgentEvidence } from './claimTypes';
import { getAuthorityLevel } from './sourceRegistry';

// Mock Evidence Store for Hackathon Scenarios
const MOCK_EVIDENCE_DB: Record<string, any[]> = {
  // CASE A: Fake scheme rumor
  'pmkisan_fake': [
    {
      source_name: 'PM KISAN Official Portal',
      source_url: 'https://pmkisan.gov.in/faq',
      content: 'The PM KISAN scheme is fully active. The 16th installment will be released soon. Beware of fake cancellation rumors.',
      published_at: new Date().toISOString()
    }
  ],
  // CASE C & D: Verified Information
  'verified_agri': [
    {
      source_name: 'Department of Agriculture & Cooperation',
      source_url: 'https://agricoop.nic.in/advisory',
      content: 'Official advisory: Monsoons are delayed in central India. Farmers are advised to delay sowing by 1 week.',
      published_at: new Date().toISOString()
    }
  ],
  // CASE E: Conflicting
  'conflict_treatment': [
    {
      source_name: 'Indian Agricultural Research Institute',
      source_url: 'https://iari.res.in/reports/onion',
      content: 'Chemical X at 20ml/L can be used to control early stages of downy mildew in onions.',
      published_at: new Date().toISOString()
    },
    {
      source_name: 'Department of Agriculture & Cooperation',
      source_url: 'https://agricoop.nic.in/ban',
      content: 'Chemical X is banned for agricultural use due to high toxicity.',
      published_at: new Date().toISOString()
    }
  ],
  // CASE B / F: No Evidence will just return []
};

// Simple heuristic to determine which mock evidence to return for the demo
const getMockDocumentsForClaim = (subject: string, predicate: string): any[] => {
  const combined = `${subject} ${predicate}`.toLowerCase();
  
  if (combined.includes('pm-kisan') || combined.includes('pm kisan') || combined.includes('scheme is fake')) {
    return MOCK_EVIDENCE_DB['pmkisan_fake'];
  }
  
  if (combined.includes('monsoon') || combined.includes('sowing')) {
    return MOCK_EVIDENCE_DB['verified_agri'];
  }
  
  if (combined.includes('conflict') || combined.includes('chemical x')) {
    return MOCK_EVIDENCE_DB['conflict_treatment'];
  }

  // By default (especially for dangerous treatments like "Mix chemical Y") return no evidence
  return [];
};

export interface EvidenceRecord {
  source_name: string;
  source_url: string;
  authority_level: string;
  retrieved_at: Date;
  content_hash: string;
  raw_content: string;
}

export const retrieveEvidenceForClaim = async (subject: string, predicate: string, value: string): Promise<EvidenceRecord[]> => {
  // In a real system, this would call a search API (e.g., Google Programmable Search for *.gov.in domains)
  // For the hackathon, we use our deterministic fixtures.
  const docs = getMockDocumentsForClaim(subject, predicate);
  
  return docs.map(doc => {
    const authority_level = getAuthorityLevel(doc.source_url);
    const content_hash = crypto.createHash('sha256').update(doc.content).digest('hex');
    
    return {
      source_name: doc.source_name,
      source_url: doc.source_url,
      authority_level,
      retrieved_at: new Date(),
      content_hash,
      raw_content: doc.content
    };
  });
};
