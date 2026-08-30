import { AuthorityLevel } from '../../shared/types/trust';

export interface SourceDefinition {
  domain: string;
  name: string;
  authority_level: AuthorityLevel;
  active: boolean;
  allowed_claim_types: string[]; // e.g. ['SCHEME', 'MARKET'] or ['*'] for all
}

const registry: SourceDefinition[] = [
  // LEVEL 1 - Primary Official
  { domain: 'pmkisan.gov.in', name: 'PM KISAN Official Portal', authority_level: 'LEVEL_1', active: true, allowed_claim_types: ['SCHEME'] },
  { domain: 'agricoop.nic.in', name: 'Department of Agriculture & Cooperation', authority_level: 'LEVEL_1', active: true, allowed_claim_types: ['*'] },
  { domain: 'enam.gov.in', name: 'e-NAM Market Data', authority_level: 'LEVEL_1', active: true, allowed_claim_types: ['MARKET'] },
  
  // LEVEL 2 - Recognized Institutions
  { domain: 'icar.org.in', name: 'Indian Council of Agricultural Research (ICAR)', authority_level: 'LEVEL_2', active: true, allowed_claim_types: ['CROP_DISEASE', 'TREATMENT', 'GENERAL_AGRICULTURE'] },
  { domain: 'iari.res.in', name: 'Indian Agricultural Research Institute', authority_level: 'LEVEL_2', active: true, allowed_claim_types: ['CROP_DISEASE', 'TREATMENT', 'GENERAL_AGRICULTURE'] },
  { domain: 'hau.ac.in', name: 'CCS Haryana Agricultural University', authority_level: 'LEVEL_2', active: true, allowed_claim_types: ['CROP_DISEASE', 'TREATMENT'] },
  
  // LEVEL 3 - Reputable Secondary
  { domain: 'nabard.org', name: 'NABARD', authority_level: 'LEVEL_3', active: true, allowed_claim_types: ['SCHEME', 'GENERAL_AGRICULTURE'] },
  { domain: 'sfacindia.com', name: 'SFAC (FPO Data)', authority_level: 'LEVEL_3', active: true, allowed_claim_types: ['FPO'] },
  
  // LEVEL 4 - Established Orgs
  { domain: 'krishijagran.com', name: 'Krishi Jagran', authority_level: 'LEVEL_4', active: true, allowed_claim_types: ['*'] }
];

export const getSourceAuthority = (url: string): SourceDefinition | null => {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    const source = registry.find(s => hostname.includes(s.domain));
    if (source && source.active) {
      return source;
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const getAuthorityLevel = (url: string): AuthorityLevel => {
  const source = getSourceAuthority(url);
  return source ? source.authority_level : 'LEVEL_5'; // Default to User Generated / Unknown
};

export const getAllowedSourcesForClaim = (claimType: string): SourceDefinition[] => {
  return registry.filter(s => s.active && (s.allowed_claim_types.includes('*') || s.allowed_claim_types.includes(claimType)));
};
