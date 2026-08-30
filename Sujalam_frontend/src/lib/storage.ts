// Storage & offline caching service for Sujalam 2.0

const CACHE_KEYS = {
  FARM: 'sujalam_cache_farm',
  CROP: 'sujalam_cache_crop',
  ADVISORY: 'sujalam_cache_advisory',
  WEATHER: 'sujalam_cache_weather',
  SOIL: 'sujalam_cache_soil',
  MARKET: 'sujalam_cache_market',
  CROP_HEALTH: 'sujalam_cache_crop_health',
  LAST_SYNC: 'sujalam_cache_last_sync',
  USER: 'sujalam_user_session',
  LANGUAGE: 'sujalam_selected_language',
};

export interface CachedEnvelope<T> {
  data: T;
  timestamp: string;
  source: string;
}

export const offlineStorage = {
  set<T>(key: string, data: T, source = 'API cache'): void {
    try {
      const envelope: CachedEnvelope<T> = {
        data,
        timestamp: new Date().toISOString(),
        source,
      };
      localStorage.setItem(key, JSON.stringify(envelope));
      localStorage.setItem(CACHE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  },

  get<T>(key: string): CachedEnvelope<T> | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as CachedEnvelope<T>;
    } catch (e) {
      console.warn('Storage read failed', e);
      return null;
    }
  },

  getLastSyncTime(): string {
    const raw = localStorage.getItem(CACHE_KEYS.LAST_SYNC);
    if (!raw) return 'Recently';
    const date = new Date(raw);
    const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} mins ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours} hours ago`;
  },

  KEYS: CACHE_KEYS,
};
