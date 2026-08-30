import { WeatherSnapshot } from '../models/WeatherSnapshot';
import { assertFarmOwnership } from '../lib/auth';
import { Farm } from '../models/Farm';

export const getLatestWeather = async (userId: string, farmId: string) => {
  await assertFarmOwnership(userId, farmId);
  const weather = await WeatherSnapshot.findOne({ farm_id: farmId }).sort({ recorded_at: -1 }).lean();
  return weather ? { ...weather, id: weather._id.toString() } : null;
};

export const refreshWeather = async (userId: string, farmId: string, isMock: boolean = false) => {
  const farm = await assertFarmOwnership(userId, farmId);
  const farmDoc = await Farm.findById(farmId);
  
  // If coordinates are missing, we will fallback to mock data instead of crashing
  const hasCoordinates = farmDoc && farmDoc.latitude && farmDoc.longitude;

  let temperature_c = 28;
  let rainfall_mm = 12;
  let rain_probability_percent = 82;
  let humidity_percent = 84;
  let wind_kmh = 15;
  let source = 'simulated';

  if (!isMock && process.env.WEATHER_API_KEY && hasCoordinates) {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${farmDoc.latitude}&lon=${farmDoc.longitude}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
      const data = await response.json();
      
      if (response.ok) {
        temperature_c = data.main.temp;
        humidity_percent = data.main.humidity;
        wind_kmh = data.wind.speed * 3.6; // convert m/s to km/h
        // OpenWeatherMap free tier doesn't give future rain probability directly in current weather, 
        // we'll estimate it based on weather conditions or leave it as demo value.
        // If it's raining now:
        if (data.rain && data.rain['1h']) {
            rainfall_mm = data.rain['1h'];
            rain_probability_percent = 100;
        } else if (data.weather.some((w: any) => w.main === 'Rain')) {
            rain_probability_percent = 90;
        } else {
            rain_probability_percent = 10;
            rainfall_mm = 0;
        }
        source = 'openweathermap';
      }
    } catch (e) {
      console.error('Weather API Error', e);
    }
  }

  const snapshot = new WeatherSnapshot({
    farm_id: farmId,
    temperature_c,
    rainfall_mm,
    rain_probability_percent,
    humidity_percent,
    wind_kmh,
    forecast_time: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next 24 hrs
    source,
    recorded_at: new Date(),
  });

  await snapshot.save();
  return { ...snapshot.toObject(), id: snapshot._id.toString() };
};

export const getWeather = async (userId: string, farmId: string) => {
  const latest = await getLatestWeather(userId, farmId);
  if (latest) {
    // If it's less than 6 hours old, return it, otherwise refresh
    const hoursOld = (Date.now() - latest.recorded_at.getTime()) / (1000 * 60 * 60);
    if (hoursOld < 6) {
      return latest;
    }
  }
  return await refreshWeather(userId, farmId, process.env.WEATHER_MODE === 'mock');
};
