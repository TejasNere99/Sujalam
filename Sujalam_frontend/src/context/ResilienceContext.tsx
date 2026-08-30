import React, { createContext, useContext, useState, useEffect } from 'react';

interface ResilienceStatus {
  state: string;
  primary_db: string;
  recovery_mode: boolean;
  last_successful_check: string;
  consecutive_failures: number;
  events_count: number;
  pending_events_count: number;
}

interface ResilienceContextType {
  status: ResilienceStatus | null;
  refresh: () => void;
}

const ResilienceContext = createContext<ResilienceContextType | undefined>(undefined);

export const ResilienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ResilienceStatus | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/resilience/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e) {
      console.error('Failed to fetch resilience status', e);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <ResilienceContext.Provider value={{ status, refresh: fetchStatus }}>
      {children}
    </ResilienceContext.Provider>
  );
};

export const useResilience = () => {
  const context = useContext(ResilienceContext);
  if (context === undefined) {
    throw new Error('useResilience must be used within a ResilienceProvider');
  }
  return context;
};
