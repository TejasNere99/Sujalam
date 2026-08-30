import mongoose, { Schema, Document } from 'mongoose';

export interface IFarmLabour extends Document {
  provider_id: string; // Could be a user ID or external agency ID
  name: string;
  phone?: string;
  labour_type: 'GENERAL' | 'HARVESTING' | 'SPRAYING' | 'IRRIGATION' | 'PLANTING' | 'PRUNING' | 'MACHINERY_OPERATOR';
  skill_tags: string[];
  workers_available: number;
  max_workers: number;
  hourly_rate?: number;
  daily_rate?: number;
  availability_status: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  available_from: Date;
  available_until: Date;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
    village?: string;
    district?: string;
  };
  service_radius_km: number;
  languages: string[];
  experience_tags: string[];
  verified: boolean;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

const FarmLabourSchema: Schema = new Schema({
  provider_id: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  labour_type: { 
    type: String, 
    enum: ['GENERAL', 'HARVESTING', 'SPRAYING', 'IRRIGATION', 'PLANTING', 'PRUNING', 'MACHINERY_OPERATOR'],
    required: true
  },
  skill_tags: { type: [String], default: [] },
  workers_available: { type: Number, required: true, min: 0 },
  max_workers: { type: Number, required: true, min: 1 },
  hourly_rate: { type: Number },
  daily_rate: { type: Number },
  availability_status: {
    type: String,
    enum: ['AVAILABLE', 'BUSY', 'UNAVAILABLE'],
    default: 'AVAILABLE'
  },
  available_from: { type: Date, required: true },
  available_until: { type: Date, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
    address: { type: String },
    village: { type: String },
    district: { type: String }
  },
  service_radius_km: { type: Number, default: 20 },
  languages: { type: [String], default: [] },
  experience_tags: { type: [String], default: [] },
  verified: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Geospatial index for location-based searching
FarmLabourSchema.index({ location: '2dsphere' });
FarmLabourSchema.index({ availability_status: 1, available_from: 1, available_until: 1 });
FarmLabourSchema.index({ labour_type: 1 });

export const FarmLabour = mongoose.model<IFarmLabour>('FarmLabour', FarmLabourSchema);
