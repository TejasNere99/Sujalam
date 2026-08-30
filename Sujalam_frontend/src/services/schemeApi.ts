import { api } from '../lib/api/client';
import { Scheme, FPO } from './types';

export const schemeApi = {
  async getSchemes(farmId: string): Promise<Scheme[]> {
    return await api.get<Scheme[]>(`/farms/${farmId}/schemes`);
  },
  async getFPOs(farmId: string): Promise<{ fpos: FPO[], data_status: string }> {
    return await api.get<{ fpos: FPO[], data_status: string }>(`/farms/${farmId}/fpos`);
  }
};
