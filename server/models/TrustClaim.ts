import mongoose, { Schema, Document } from 'mongoose';
import { ClaimType } from '../../shared/types/trust';

export interface ITrustClaim extends Document {
  claim_type: ClaimType;
  subject: string;
  predicate: string;
  value: string;
  raw_text: string;
  normalized_claim: string;
  claim_fingerprint: string;
  claim_cluster_id: string;
  created_at: Date;
  updated_at: Date;
}

const TrustClaimSchema: Schema = new Schema({
  claim_type: { type: String, required: true },
  subject: { type: String, required: true },
  predicate: { type: String, required: true },
  value: { type: String, required: true },
  raw_text: { type: String, required: true },
  normalized_claim: { type: String, required: true },
  claim_fingerprint: { type: String, required: true },
  claim_cluster_id: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

TrustClaimSchema.index({ claim_fingerprint: 1 });
TrustClaimSchema.index({ claim_cluster_id: 1 });

export const TrustClaim = mongoose.model<ITrustClaim>('TrustClaim', TrustClaimSchema);
