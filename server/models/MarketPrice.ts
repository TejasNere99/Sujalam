import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketPrice extends Document {
  crop_name: string;
  market_name: string | null;
  price_per_quintal: number | null;
  trend_7d_percent: number | null;
  recorded_at: Date;
  source: string;
}

const MarketPriceSchema: Schema = new Schema({
  crop_name: { type: String, required: true },
  market_name: { type: String, default: null },
  price_per_quintal: { type: Number, default: null },
  trend_7d_percent: { type: Number, default: null },
  recorded_at: { type: Date, required: true },
  source: { type: String, required: true },
});

MarketPriceSchema.index({ crop_name: 1, market_name: 1, recorded_at: -1 });

export const MarketPrice = mongoose.model<IMarketPrice>('MarketPrice', MarketPriceSchema);
