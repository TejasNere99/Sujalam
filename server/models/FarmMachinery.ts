import mongoose, { Schema, Document } from 'mongoose';

export interface IFarmMachinery extends Document {
  provider_id: string; // Machine owner
  machine_type: 'TRACTOR' | 'ROTAVATOR' | 'CULTIVATOR' | 'SEEDER' | 'SPRAYER' | 'HARVESTER' | 'COMBINE' | 'THRESHER' | 'PUMP' | 'OTHER';
  machine_name: string;
  brand_model?: string;
  supported_operations: string[];
  hourly_rate: number;
  daily_rate?: number;
  operator_available: boolean;
  availability_status: 'AVAILABLE' | 'BUSY' | 'MAINTENANCE' | 'UNAVAILABLE';
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
  verified: boolean;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

const FarmMachinerySchema: Schema = new Schema({
  provider_id: { type: String, required: true },
  machine_type: { 
    type: String, 
    enum: ['TRACTOR', 'ROTAVATOR', 'CULTIVATOR', 'SEEDER', 'SPRAYER', 'HARVESTER', 'COMBINE', 'THRESHER', 'PUMP', 'OTHER'],
    required: true
  },
  machine_name: { type: String, required: true },
  brand_model: { type: String },
  supported_operations: { type: [String], default: [] },
  hourly_rate: { type: Number, required: true },
  daily_rate: { type: Number },
  operator_available: { type: Boolean, default: false },
  availability_status: {
    type: String,
    enum: ['AVAILABLE', 'BUSY', 'MAINTENANCE', 'UNAVAILABLE'],
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
  verified: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

FarmMachinerySchema.index({ location: '2dsphere' });
FarmMachinerySchema.index({ availability_status: 1, available_from: 1, available_until: 1 });
FarmMachinerySchema.index({ machine_type: 1 });

export const FarmMachinery = mongoose.model<IFarmMachinery>('FarmMachinery', FarmMachinerySchema);
