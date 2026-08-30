import mongoose, { Schema, Document } from 'mongoose';
import { TruthVerdict } from '../../shared/types/trust';

export interface ITrustAuditLog extends Document {
  claim_id: mongoose.Types.ObjectId;
  input_hash: string;
  verdict: TruthVerdict;
  truth_score: number;
  integrity_risk: number;
  propagation_risk: number;
  coordination_risk: number;
  safety_risk: number;
  human_review_required: boolean;
  evidence_count: number;
  contradiction_count: number;
  timestamp: Date;
  processing_metadata: any;
}

const TrustAuditLogSchema: Schema = new Schema({
  claim_id: { type: Schema.Types.ObjectId, ref: 'TrustClaim', required: true },
  input_hash: { type: String, required: true },
  verdict: { type: String, required: true },
  truth_score: { type: Number, required: true },
  integrity_risk: { type: Number, required: true },
  propagation_risk: { type: Number, required: true },
  coordination_risk: { type: Number, required: true },
  safety_risk: { type: Number, required: true },
  human_review_required: { type: Boolean, required: true },
  evidence_count: { type: Number, required: true },
  contradiction_count: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  processing_metadata: { type: Schema.Types.Mixed, required: true }
});

TrustAuditLogSchema.index({ claim_id: 1 });
TrustAuditLogSchema.index({ timestamp: -1 });

export const TrustAuditLog = mongoose.model<ITrustAuditLog>('TrustAuditLog', TrustAuditLogSchema);
