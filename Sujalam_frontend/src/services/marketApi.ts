import { api } from '../lib/api/client';
import { MarketPrice } from './types';

export const marketApi = {
  async getMarketPrice(farmId: string): Promise<MarketPrice> {
    return await api.get<MarketPrice>(`/farms/${farmId}/market`);
  }
};
