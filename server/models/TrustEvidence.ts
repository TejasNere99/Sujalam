import mongoose, { Schema, Document } from 'mongoose';
import { AuthorityLevel, EvidenceStatus } from '../../shared/types/trust';

export interface ITrustEvidence extends Document {
  claim_id: mongoose.Types.ObjectId;
  source_name: string;
  source_url: string;
  authority_level: AuthorityLevel;
  retrieved_at: Date;
  content_hash: string;
  evidence_excerpt: string;
  supports_claim: boolean;
  contradicts_claim: boolean;
  evidence_status: EvidenceStatus;
}

const TrustEvidenceSchema: Schema = new Schema({
  claim_id: { type: Schema.Types.ObjectId, ref: 'TrustClaim', required: true },
  source_name: { type: String, required: true },
  source_url: { type: String, required: true },
  authority_level: { type: String, required: true },
  retrieved_at: { type: Date, default: Date.now },
  content_hash: { type: String, required: true },
  evidence_excerpt: { type: String, required: true },
  supports_claim: { type: Boolean, required: true },
  contradicts_claim: { type: Boolean, required: true },
  evidence_status: { type: String, required: true }
});

TrustEvidenceSchema.index({ claim_id: 1 });

export const TrustEvidence = mongoose.model<ITrustEvidence>('TrustEvidence', TrustEvidenceSchema);
