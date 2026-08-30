import mongoose, { Schema, Document } from 'mongoose';

export interface IAdvisory extends Document {
  farm_id: mongoose.Types.ObjectId;
  generated_at: Date;
  overall_status: 'normal' | 'attention' | 'urgent';
  irrigation: {
    decision: 'IRRIGATE' | 'WAIT' | 'SKIP';
    timing: string;
    reason: string;
    confidence: number;
  };
  crop_health: {
    decision: 'MONITOR' | 'INSPECT' | 'ACT';
    reason: string;
    confidence: number;
  };
  market: {
    decision: 'SELL' | 'HOLD';
    timing: string;
    reason: string;
    confidence: number;
  };
  weather: {
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
    summary: string;
  };
  top_actions: string[];
  supporting_signals: {
    rain_probability_percent: number | null;
    soil_moisture_percent: number | null;
    disease_probability_percent: number | null;
    market_trend_percent: number | null;
  };
  resource_recommendation?: {
    action: 'BOOK' | 'WAIT' | 'NO_MATCH' | 'INSUFFICIENT_DATA';
    resource_ids: string[];
    reason: string;
    estimated_cost: number;
  };
  ai_metadata?: {
    provider: string;
    model?: string;
    agents_used: string[];
    fallback: boolean;
    latency_ms?: number;
    generated_at?: string;
  };
}

const AdvisorySchema: Schema = new Schema({
  farm_id: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
  generated_at: { type: Date, required: true },
  overall_status: { type: String, enum: ['normal', 'attention', 'urgent'], required: true },
  irrigation: {
    decision: { type: String, enum: ['IRRIGATE', 'WAIT', 'SKIP'], required: true },
    timing: { type: String, required: true },
    reason: { type: String, required: true },
    confidence: { type: Number, required: true },
  },
  crop_health: {
    decision: { type: String, enum: ['MONITOR', 'INSPECT', 'ACT'], required: true },
    reason: { type: String, required: true },
    confidence: { type: Number, required: true },
  },
  market: {
    decision: { type: String, enum: ['SELL', 'HOLD'], required: true },
    timing: { type: String, required: true },
    reason: { type: String, required: true },
    confidence: { type: Number, required: true },
  },
  weather: {
    risk: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
    summary: { type: String, required: true },
  },
  top_actions: { type: [String], required: true },
  supporting_signals: {
    rain_probability_percent: { type: Number, default: null },
    soil_moisture_percent: { type: Number, default: null },
    disease_probability_percent: { type: Number, default: null },
    market_trend_percent: { type: Number, default: null },
  },
  resource_recommendation: {
    action: { type: String, enum: ['BOOK', 'WAIT', 'NO_MATCH', 'INSUFFICIENT_DATA'] },
    resource_ids: { type: [String] },
    reason: { type: String },
    estimated_cost: { type: Number }
  },
  ai_metadata: {
    provider: { type: String },
    model: { type: String },
    agents_used: { type: [String] },
    fallback: { type: Boolean },
    latency_ms: { type: Number },
    generated_at: { type: String },
  }
});

AdvisorySchema.index({ farm_id: 1, generated_at: -1 });

export const Advisory = mongoose.model<IAdvisory>('Advisory', AdvisorySchema);
