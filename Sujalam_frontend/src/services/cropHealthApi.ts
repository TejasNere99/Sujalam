import { api } from '../lib/api/client';
import { CropHealth } from './types';

export const cropHealthApi = {
  async analyzeImage(farmId: string, imageUrl: string): Promise<CropHealth> {
    return await api.post<CropHealth>(`/farms/${farmId}/crop-health/analyze`, {
      imageUrl
    });
  },

  async getLatestHealth(farmId: string): Promise<CropHealth> {
    return await api.get<CropHealth>(`/farms/${farmId}/crop-health`);
  }
};
