import React from 'react';
import { useResilience } from '../context/ResilienceContext';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ResilienceBanner: React.FC = () => {
  const { status } = useResilience();

  if (!status) return null;

  if (status.state === 'RESTORING' || status.state === 'SYNCING') {
    return (
      <div className="bg-blue-500 text-white px-4 py-2 flex items-center justify-center text-sm font-medium">
        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        RESTORING DATA: Synchronizing pending actions...
      </div>
    );
  }

  if (status.recovery_mode) {
    return (
      <div className="bg-yellow-500 text-white px-4 py-2 flex items-center justify-center text-sm font-medium sticky top-0 z-50 shadow-md">
        <AlertCircle className="w-4 h-4 mr-2" />
        RECOVERY MODE: Primary database is temporarily unavailable. Sujalam is operating with recovered data. New actions will be synced automatically.
      </div>
    );
  }

  return null;
};
