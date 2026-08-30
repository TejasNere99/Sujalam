import React from 'react';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { useOffline } from '../../context/OfflineContext';
import { useLanguage } from '../../context/LanguageContext';

export const OfflineIndicator: React.FC = () => {
  const { isOffline, lastSyncTime, setManualSync } = useOffline();
  const { t } = useLanguage();

  if (!isOffline) return null;

  return (
    <div
      role="status"
      className="bg-amber-900 text-amber-50 px-4 py-2.5 sm:py-3 shadow-md flex items-center justify-between text-xs sm:text-sm border-b border-amber-800"
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="p-1 rounded-md bg-amber-800/80 shrink-0">
          <WifiOff className="w-4 h-4 text-amber-200" />
        </div>
        <div className="truncate">
          <span className="font-bold mr-1.5">{t.common.offlineTitle}</span>
          <span className="text-amber-200 hidden sm:inline">
            — {t.common.offlineDesc.replace('{time}', lastSyncTime)}
          </span>
          <span className="text-amber-200 sm:hidden">
            (Cached {lastSyncTime})
          </span>
        </div>
      </div>

      <button
        onClick={() => {
          if (navigator.onLine) {
            setManualSync();
            window.location.reload();
          }
        }}
        className="ml-3 px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 font-semibold text-xs flex items-center gap-1 shrink-0 border border-amber-700"
      >
        <RefreshCw className="w-3 h-3" />
        <span>{t.common.refresh}</span>
      </button>
    </div>
  );
};
