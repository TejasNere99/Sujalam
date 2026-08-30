import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Farm } from '../models/Farm';
import { FarmCrop } from '../models/FarmCrop';
import { SoilReading } from '../models/SoilReading';
import { WeatherSnapshot } from '../models/WeatherSnapshot';
import { CropHealth } from '../models/CropHealth';
import { MarketPrice } from '../models/MarketPrice';
import { Scheme } from '../models/Scheme';
import { connectMongoDB } from '../lib/mongodb';

const seed = async () => {
  await connectMongoDB();

  // Clear existing
  await User.deleteMany({ email: 'demo@sujalam.com' });
  await Farm.deleteMany({ name: 'Demo Farm' });
  await FarmCrop.deleteMany({ crop_name: 'Cotton' });
  await MarketPrice.deleteMany({ crop_name: 'Cotton' });

  // 1. User
  const password_hash = await bcrypt.hash('demo123', 10);
  const user = new User({
    name: 'Demo Farmer',
    email: 'demo@sujalam.com',
    phone: '+919999999999',
    password_hash,
    language: 'en'
  });
  await user.save();

  // 2. Farm
  const farm = new Farm({
    user_id: user._id,
    name: 'Demo Farm',
    latitude: 19.076,
    longitude: 72.877,
    location_name: 'Maharashtra',
    area_acres: 2.5,
    soil_type: 'Black Soil',
    irrigation_type: 'Borewell',
  });
  await farm.save();

  // 3. Crop
  const crop = new FarmCrop({
    farm_id: farm._id,
    crop_name: 'Cotton',
    variety: 'Bt Cotton',
    sowing_date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
    growth_stage: 'Flowering',
  });
  await crop.save();

  // 4. Soil
  const soil = new SoilReading({
    farm_id: farm._id,
    moisture_percent: 67,
    ph: 7.2,
    nitrogen: 40,
    phosphorus: 20,
    potassium: 30,
    source: 'sensor',
    recorded_at: new Date()
  });
  await soil.save();

  // 5. Weather
  const weather = new WeatherSnapshot({
    farm_id: farm._id,
    temperature_c: 28,
    rainfall_mm: 15,
    rain_probability_percent: 82,
    humidity_percent: 84,
    wind_kmh: 12,
    forecast_time: new Date(Date.now() + 24 * 60 * 60 * 1000),
    source: 'simulated',
    recorded_at: new Date()
  });
  await weather.save();

  // 6. Crop Health
  const health = new CropHealth({
    farm_id: farm._id,
    crop_id: crop._id,
    image_url: 'https://example.com/demo-cotton.jpg',
    crop_name: 'Cotton',
    disease_name: 'Leaf Spot',
    disease_probability: 81,
    health_status: 'high_risk',
    recommended_action: 'Inspect affected leaves today.',
    source: 'mock',
    created_at: new Date()
  });
  await health.save();

  // 7. Market
  const market = new MarketPrice({
    crop_name: 'Cotton',
    market_name: 'Local Mandi',
    price_per_quintal: 7100,
    trend_7d_percent: 4.2,
    recorded_at: new Date(),
    source: 'simulated'
  });
  await market.save();

  console.log('✅ Demo seed completed successfully!');
  console.log(`Demo User: demo@sujalam.com / demo123`);
  console.log(`Demo Farm ID: ${farm._id.toString()}`);
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
