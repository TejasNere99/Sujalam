import mongoose, { Schema, Document } from 'mongoose';

export interface IScheme extends Document {
  name: string;
  description: string;
  eligibility: string | null;
  benefit: string | null;
  action_url: string | null;
  region: string | null;
  crop_types: string[] | null;
  created_at: Date;
}

const SchemeSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: { type: String, default: null },
  benefit: { type: String, default: null },
  action_url: { type: String, default: null },
  region: { type: String, default: null },
  crop_types: { type: [String], default: null },
  created_at: { type: Date, required: true },
});

SchemeSchema.index({ region: 1 });
SchemeSchema.index({ crop_types: 1 });

export const Scheme = mongoose.model<IScheme>('Scheme', SchemeSchema);
