import { api } from '../lib/api/client';
import { Farm, FarmCrop } from './types';
import { offlineStorage } from '../lib/storage';

export const farmApi = {
  async getFarms(): Promise<Farm[]> {
    return await api.get<Farm[]>('/farms');
  },

  async getFarmProfile(farmId: string): Promise<{ farm: Farm; crop: FarmCrop | null; source: string; cached: boolean }> {
    try {
      const farm = await api.get<Farm>(`/farms/${farmId}`);
      const crop = await api.get<FarmCrop>(`/farms/${farmId}/crop`).catch(() => null);

      offlineStorage.set(offlineStorage.KEYS.FARM, farm, 'Latest Server Data');
      if (crop) offlineStorage.set(offlineStorage.KEYS.CROP, crop, 'Latest Server Data');

      return { farm, crop, source: 'Server', cached: false };
    } catch (e: any) {
      if (!navigator.onLine) {
        const cachedFarm = offlineStorage.get<Farm>(offlineStorage.KEYS.FARM);
        const cachedCrop = offlineStorage.get<FarmCrop>(offlineStorage.KEYS.CROP);
        if (cachedFarm) {
          return { farm: cachedFarm.data, crop: cachedCrop?.data || null, source: 'Offline Cache', cached: true };
        }
      }
      throw e;
    }
  },

  async createFarm(farmData: Partial<Farm>): Promise<Farm> {
    const farm = await api.post<Farm>('/farms', farmData);
    offlineStorage.set(offlineStorage.KEYS.FARM, farm, 'Created Farm');
    return farm;
  },

  async updateFarm(farmId: string, farmData: Partial<Farm>): Promise<Farm> {
    const res = await api.patch<Farm>(`/farms/${farmId}`, farmData);
    offlineStorage.set(offlineStorage.KEYS.FARM, res, 'Updated Server Data');
    return res;
  },

  async deleteFarm(farmId: string): Promise<void> {
    await api.delete<void>(`/farms/${farmId}`);
  },

  async createCrop(farmId: string, cropData: Partial<FarmCrop>): Promise<FarmCrop> {
    const crop = await api.post<FarmCrop>(`/farms/${farmId}/crop`, cropData);
    offlineStorage.set(offlineStorage.KEYS.CROP, crop, 'Created Crop');
    return crop;
  },

  async updateCrop(farmId: string, cropData: Partial<FarmCrop>): Promise<FarmCrop> {
    // Backend uses POST to /crop which upserts
    const crop = await api.post<FarmCrop>(`/farms/${farmId}/crop`, cropData);
    offlineStorage.set(offlineStorage.KEYS.CROP, crop, 'Updated Crop');
    return crop;
  }
};
