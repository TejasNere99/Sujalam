import mongoose, { Schema, Document } from 'mongoose';

export interface IFarmCrop extends Document {
  farm_id: mongoose.Types.ObjectId;
  crop_name: string;
  variety: string | null;
  sowing_date: Date | null;
  growth_stage: string | null;
  crop_history: string | null;
  created_at: Date;
  updated_at: Date;
}

const FarmCropSchema: Schema = new Schema({
  farm_id: { type: Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
  crop_name: { type: String, required: true },
  variety: { type: String, default: null },
  sowing_date: { type: Date, default: null },
  growth_stage: { type: String, default: null },
  crop_history: { type: String, default: null },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const FarmCrop = mongoose.model<IFarmCrop>('FarmCrop', FarmCropSchema);
