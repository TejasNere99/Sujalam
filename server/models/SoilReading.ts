import mongoose, { Schema, Document } from 'mongoose';

export interface ISoilReading extends Document {
  farm_id: mongoose.Types.ObjectId;
  moisture_percent: number | null;
  ph: number | null;
  nitrogen: number | null;
  phosphorus: number | null;
  potassium: number | null;
  groundwater_level: number | null;
  source: 'manual' | 'sensor' | 'simulated';
  recorded_at: Date;
}

const SoilReadingSchema: Schema = new Schema({
  farm_id: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
  moisture_percent: { type: Number, default: null },
  ph: { type: Number, default: null },
  nitrogen: { type: Number, default: null },
  phosphorus: { type: Number, default: null },
  potassium: { type: Number, default: null },
  groundwater_level: { type: Number, default: null },
  source: { type: String, enum: ['manual', 'sensor', 'simulated'], required: true },
  recorded_at: { type: Date, required: true },
});

SoilReadingSchema.index({ farm_id: 1, recorded_at: -1 });

export const SoilReading = mongoose.model<ISoilReading>('SoilReading', SoilReadingSchema);
