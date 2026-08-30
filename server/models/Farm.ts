import mongoose, { Schema, Document } from 'mongoose';

export interface IFarm extends Document {
  user_id: mongoose.Types.ObjectId;
  name: string | null;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  area_acres: number | null;
  soil_type: string | null;
  irrigation_type: string | null;
  created_at: Date;
  updated_at: Date;
}

const FarmSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, default: null },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  location_name: { type: String, default: null },
  area_acres: { type: Number, default: null },
  soil_type: { type: String, default: null },
  irrigation_type: { type: String, default: null },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const Farm = mongoose.model<IFarm>('Farm', FarmSchema);
