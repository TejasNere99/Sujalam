import mongoose, { Schema, Document } from 'mongoose';

export interface IFarmResourceRequest extends Document {
  farm_id: mongoose.Types.ObjectId;
  farmer_id: string; // The user requesting it
  resource_type: 'LABOUR' | 'MACHINERY' | 'COMBINED';
  requested_operation: string;
  crop?: string;
  crop_stage?: string;
  farm_area_acres?: number;
  required_workers?: number;
  required_machine_type?: string;
  requested_date: Date;
  start_time: string; // e.g., "08:00"
  duration_hours: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  matched_resource_ids: {
    resource_id: mongoose.Types.ObjectId;
    type: 'LABOUR' | 'MACHINERY';
    provider_id: string;
  }[];
  estimated_cost: number;
  booking_status: 'PENDING' | 'MATCHED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  created_at: Date;
  updated_at: Date;
}

const FarmResourceRequestSchema: Schema = new Schema({
  farm_id: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
  farmer_id: { type: String, required: true },
  resource_type: { 
    type: String, 
    enum: ['LABOUR', 'MACHINERY', 'COMBINED'],
    required: true
  },
  requested_operation: { type: String, required: true },
  crop: { type: String },
  crop_stage: { type: String },
  farm_area_acres: { type: Number },
  required_workers: { type: Number },
  required_machine_type: { type: String },
  requested_date: { type: Date, required: true },
  start_time: { type: String, required: true },
  duration_hours: { type: Number, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  matched_resource_ids: [{
    resource_id: { type: Schema.Types.ObjectId, required: true }, // ref to FarmLabour or FarmMachinery
    type: { type: String, enum: ['LABOUR', 'MACHINERY'], required: true },
    provider_id: { type: String, required: true }
  }],
  estimated_cost: { type: Number, default: 0 },
  booking_status: {
    type: String,
    enum: ['PENDING', 'MATCHED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

FarmResourceRequestSchema.index({ farm_id: 1 });
FarmResourceRequestSchema.index({ farmer_id: 1 });
FarmResourceRequestSchema.index({ booking_status: 1 });

export const FarmResourceRequest = mongoose.model<IFarmResourceRequest>('FarmResourceRequest', FarmResourceRequestSchema);
