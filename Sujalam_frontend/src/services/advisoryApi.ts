import { api } from '../lib/api/client';
import { FarmAdvisory } from './types';
import { offlineStorage } from '../lib/storage';

export const advisoryApi = {
  async getAdvisory(farmId: string): Promise<FarmAdvisory> {
    try {
      const adv = await api.get<FarmAdvisory>(`/farms/${farmId}/advisory`);
      offlineStorage.set(offlineStorage.KEYS.ADVISORY, adv, 'Latest Server Data');
      return adv;
    } catch (e: any) {
      if (!navigator.onLine) {
        const cached = offlineStorage.get<FarmAdvisory>(offlineStorage.KEYS.ADVISORY);
        if (cached) return cached.data;
      }
      throw e;
    }
  },

  async refreshAdvisory(farmId: string): Promise<FarmAdvisory> {
    const adv = await api.post<FarmAdvisory>(`/farms/${farmId}/advisory/refresh`, {});
    offlineStorage.set(offlineStorage.KEYS.ADVISORY, adv, 'Refreshed Server Data');
    return adv;
  }
};
