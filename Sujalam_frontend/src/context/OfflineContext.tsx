import React, { createContext, useContext, useState, useEffect } from 'react';
import { offlineStorage } from '../lib/storage';

interface OfflineContextType {
  isOffline: boolean;
  lastSyncTime: string;
  setManualSync: () => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState<string>(offlineStorage.getLastSyncTime());

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setLastSyncTime('Just now');
    };
    const handleOffline = () => {
      setIsOffline(true);
      setLastSyncTime(offlineStorage.getLastSyncTime());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(() => {
      setLastSyncTime(offlineStorage.getLastSyncTime());
    }, 60000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const setManualSync = () => {
    setLastSyncTime('Just now');
  };

  return (
    <OfflineContext.Provider value={{ isOffline, lastSyncTime, setManualSync }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
