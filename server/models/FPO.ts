import mongoose, { Schema, Document } from 'mongoose';

export interface IFPO extends Document {
  name: string;
  registration_number?: string;
  description?: string;
  district?: string;
  state?: string;
  block?: string;
  village?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  distance_km?: number | null;
  member_count?: number | null;
  contact_person?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  services: string[];
  crops_supported?: string[];
  
  // Provenance fields
  source_name: string;
  source_url: string;
  source_document?: string;
  source_record_reference?: string;
  
  verified: boolean;
  active: boolean;
  last_verified_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const FPOSchema: Schema = new Schema({
  name: { type: String, required: true },
  registration_number: { type: String },
  description: { type: String },
  district: { type: String },
  state: { type: String },
  block: { type: String },
  village: { type: String },
  address: { type: String },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  distance_km: { type: Number, default: null },
  member_count: { type: Number, default: null },
  contact_person: { type: String },
  phone: { type: String },
  whatsapp: { type: String },
  email: { type: String },
  website: { type: String },
  services: { type: [String], default: [] },
  crops_supported: { type: [String], default: [] },
  
  source_name: { type: String, required: true },
  source_url: { type: String, required: true },
  source_document: { type: String },
  source_record_reference: { type: String },
  
  verified: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  last_verified_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

FPOSchema.index({ state: 1, district: 1 });

export const FPO = mongoose.model<IFPO>('FPO', FPOSchema);
