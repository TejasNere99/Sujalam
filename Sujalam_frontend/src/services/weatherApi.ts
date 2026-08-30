import { api } from '../lib/api/client';
import { WeatherSnapshot, SoilReading } from './types';
import { offlineStorage } from '../lib/storage';

export const weatherApi = {
  async getWeather(farmId: string): Promise<WeatherSnapshot> {
    const data = await api.get<WeatherSnapshot>(`/farms/${farmId}/weather`);
    offlineStorage.set(offlineStorage.KEYS.WEATHER, data, 'Latest Server Data');
    return data;
  },

  async getSoil(farmId: string): Promise<SoilReading> {
    const data = await api.get<SoilReading>(`/farms/${farmId}/soil`);
    offlineStorage.set(offlineStorage.KEYS.SOIL, data, 'Latest Server Data');
    return data;
  },

  async refreshWeather(farmId: string): Promise<WeatherSnapshot> {
    const data = await api.post<WeatherSnapshot>(`/farms/${farmId}/weather/refresh`, {});
    offlineStorage.set(offlineStorage.KEYS.WEATHER, data, 'Refreshed Server Data');
    return data;
  },

  async addSoilReading(farmId: string, reading: {
    moisture_percent?: number;
    ph?: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    groundwater_level?: number;
    source?: string;
  }): Promise<SoilReading> {
    const data = await api.post<SoilReading>(`/farms/${farmId}/soil`, reading);
    offlineStorage.set(offlineStorage.KEYS.SOIL, data, 'Updated Server Data');
    return data;
  }
};
