import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Farm, FarmCrop, FarmAdvisory } from '../services/types';
import { farmApi } from '../services/farmApi';
import { advisoryApi } from '../services/advisoryApi';
import { useAuth } from './AuthContext';

interface FarmContextType {
  farms: Farm[];
  currentFarm: Farm | null;
  currentCrop: FarmCrop | null;
  currentAdvisory: FarmAdvisory | null;
  isLoadingFarm: boolean;
  isLoadingAdvisory: boolean;
  isCached: boolean;
  setCurrentFarm: (farm: Farm) => void;
  refreshFarm: () => Promise<void>;
  refreshAdvisory: () => Promise<void>;
  updateFarm: (data: Partial<Farm>) => Promise<void>;
  updateCrop: (data: Partial<FarmCrop>) => Promise<void>;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [currentFarm, setCurrentFarmState] = useState<Farm | null>(null);
  const [currentCrop, setCurrentCrop] = useState<FarmCrop | null>(null);
  const [currentAdvisory, setCurrentAdvisory] = useState<FarmAdvisory | null>(null);
  const [isLoadingFarm, setIsLoadingFarm] = useState(false);
  const [isLoadingAdvisory, setIsLoadingAdvisory] = useState(false);
  const [isCached, setIsCached] = useState(false);

  const getFarmId = (farm: Farm) => (farm as any).id || (farm as any)._id;

  const loadFarmData = useCallback(async (farmId: string) => {
    setIsLoadingFarm(true);
    try {
      const { farm, crop, cached } = await farmApi.getFarmProfile(farmId);
      setCurrentFarmState(farm);
      setCurrentCrop(crop);
      setIsCached(cached);
    } catch (e) {
      console.error('Failed to load farm data', e);
    } finally {
      setIsLoadingFarm(false);
    }
  }, []);

  const loadAdvisory = useCallback(async (farmId: string) => {
    setIsLoadingAdvisory(true);
    try {
      const adv = await advisoryApi.getAdvisory(farmId);
      setCurrentAdvisory(adv);
    } catch (e) {
      console.error('Failed to load advisory', e);
    } finally {
      setIsLoadingAdvisory(false);
    }
  }, []);

  // Load farms after authentication
  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      if (!isAuthenticated) {
        // Clear everything on logout
        setFarms([]);
        setCurrentFarmState(null);
        setCurrentCrop(null);
        setCurrentAdvisory(null);
      }
      return;
    }

    const initializeFarms = async () => {
      try {
        const userFarms = await farmApi.getFarms();
        setFarms(userFarms);
        if (userFarms.length > 0) {
          const farmId = getFarmId(userFarms[0]);
          await loadFarmData(farmId);
          await loadAdvisory(farmId);
        }
      } catch (e) {
        console.error('Failed to initialize farms', e);
      }
    };

    initializeFarms();
  }, [isAuthenticated, authLoading]);

  const setCurrentFarm = async (farm: Farm) => {
    setCurrentFarmState(farm);
    const farmId = getFarmId(farm);
    await loadFarmData(farmId);
    await loadAdvisory(farmId);
  };

  const refreshFarm = async () => {
    if (!currentFarm) return;
    await loadFarmData(getFarmId(currentFarm));
  };

  const refreshAdvisory = async () => {
    if (!currentFarm) return;
    const farmId = getFarmId(currentFarm);
    setIsLoadingAdvisory(true);
    try {
      const adv = await advisoryApi.refreshAdvisory(farmId);
      setCurrentAdvisory(adv);
    } catch (e) {
      console.error('Failed to refresh advisory', e);
    } finally {
      setIsLoadingAdvisory(false);
    }
  };

  const updateFarm = async (data: Partial<Farm>) => {
    if (!currentFarm) return;
    const farmId = getFarmId(currentFarm);
    const updated = await farmApi.updateFarm(farmId, data);
    setCurrentFarmState(updated);
    // Refresh advisory since farm params changed
    await loadAdvisory(farmId);
  };

  const updateCrop = async (data: Partial<FarmCrop>) => {
    if (!currentFarm) return;
    const farmId = getFarmId(currentFarm);
    const updated = await farmApi.updateCrop(farmId, data);
    setCurrentCrop(updated);
    // Refresh advisory since crop changed
    await loadAdvisory(farmId);
  };

  return (
    <FarmContext.Provider
      value={{
        farms,
        currentFarm,
        currentCrop,
        currentAdvisory,
        isLoadingFarm,
        isLoadingAdvisory,
        isCached,
        setCurrentFarm,
        refreshFarm,
        refreshAdvisory,
        updateFarm,
        updateCrop,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = (): FarmContextType => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
