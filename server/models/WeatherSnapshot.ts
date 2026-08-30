import mongoose, { Schema, Document } from 'mongoose';

export interface IWeatherSnapshot extends Document {
  farm_id: mongoose.Types.ObjectId;
  temperature_c: number | null;
  rainfall_mm: number | null;
  rain_probability_percent: number | null;
  humidity_percent: number | null;
  wind_kmh: number | null;
  forecast_time: Date;
  source: string;
  recorded_at: Date;
}

const WeatherSnapshotSchema: Schema = new Schema({
  farm_id: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
  temperature_c: { type: Number, default: null },
  rainfall_mm: { type: Number, default: null },
  rain_probability_percent: { type: Number, default: null },
  humidity_percent: { type: Number, default: null },
  wind_kmh: { type: Number, default: null },
  forecast_time: { type: Date, required: true },
  source: { type: String, required: true },
  recorded_at: { type: Date, required: true },
});

WeatherSnapshotSchema.index({ farm_id: 1, forecast_time: -1 });
WeatherSnapshotSchema.index({ farm_id: 1, recorded_at: -1 });

export const WeatherSnapshot = mongoose.model<IWeatherSnapshot>('WeatherSnapshot', WeatherSnapshotSchema);
