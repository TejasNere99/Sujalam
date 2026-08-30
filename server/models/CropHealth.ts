import mongoose, { Schema, Document } from 'mongoose';

export interface ICropHealth extends Document {
  farm_id: mongoose.Types.ObjectId;
  crop_id: mongoose.Types.ObjectId | null;
  image_url: string | null;
  crop_name: string | null;
  disease_name: string | null;
  disease_probability: number | null;
  health_status: 'healthy' | 'needs_attention' | 'high_risk' | 'unknown';
  recommended_action: string | null;
  source: string;
  created_at: Date;
}

const CropHealthSchema: Schema = new Schema({
  farm_id: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
  crop_id: { type: Schema.Types.ObjectId, ref: 'FarmCrop', default: null },
  image_url: { type: String, default: null },
  crop_name: { type: String, default: null },
  disease_name: { type: String, default: null },
  disease_probability: { type: Number, default: null },
  health_status: { type: String, enum: ['healthy', 'needs_attention', 'high_risk', 'unknown'], required: true },
  recommended_action: { type: String, default: null },
  source: { type: String, required: true },
  created_at: { type: Date, required: true },
});

CropHealthSchema.index({ farm_id: 1, created_at: -1 });

export const CropHealth = mongoose.model<ICropHealth>('CropHealth', CropHealthSchema);
