import React, { useState, useEffect } from 'react';
import { schemeApi } from '../services/schemeApi';
import { useFarm } from '../context/FarmContext';
import { Scheme, FPO } from '../services/types';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { FPOCard } from '../components/schemes/FPOCard';
import { Skeleton } from '../components/ui/Skeleton';
import { useLanguage } from '../context/LanguageContext';
import { Building2, RefreshCw, AlertTriangle, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const SchemesPage: React.FC = () => {
  const { t } = useLanguage();
  const { currentFarm } = useFarm();
  const farmId = currentFarm ? ((currentFarm as any).id || (currentFarm as any)._id) : null;

  const [activeTab, setActiveTab] = useState<'schemes' | 'fpos'>('schemes');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [fpos, setFpos] = useState<FPO[]>([]);
  const [dataStatus, setDataStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadData = async (id: string) => {
    try {
      const [schemesData, fposResponse] = await Promise.all([
        schemeApi.getSchemes(id),
        schemeApi.getFPOs(id).catch(() => ({ fpos: [], data_status: 'error' }))
      ]);
      setSchemes(schemesData);
      setFpos(fposResponse.fpos || []);
      setDataStatus(fposResponse.data_status || 'official_data_unavailable');
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load data.');
    }
  };

  useEffect(() => {
    if (!farmId) return;
    setIsLoading(true);
    loadData(farmId).finally(() => setIsLoading(false));
  }, [farmId]);

  const handleRefresh = async () => {
    if (!farmId) return;
    setIsRefreshing(true);
    await loadData(farmId).finally(() => setIsRefreshing(false));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-950">{t.schemes.pageTitle || 'Government Schemes & FPO Support'}</h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">{t.schemes.pageSubtitle || 'Discover relevant schemes and connect with nearby organizations.'}</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRefresh}
          isLoading={isRefreshing}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          disabled={isRefreshing}
        >
          Refresh
        </Button>
      </div>

      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-ivory-300 w-fit">
        <button
          onClick={() => setActiveTab('schemes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'schemes'
              ? 'bg-forest-900 text-white shadow-subtle'
              : 'text-charcoal-600 hover:bg-ivory-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t.schemes.tabSchemes || 'Government Schemes'} ({schemes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('fpos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'fpos'
              ? 'bg-forest-900 text-white shadow-subtle'
              : 'text-charcoal-600 hover:bg-ivory-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.schemes.tabFPO || 'Nearby FPOs'} ({fpos.length})</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
          <button onClick={handleRefresh} className="ml-auto underline text-xs font-bold">Retry</button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : activeTab === 'schemes' ? (
        schemes.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-ivory-300">
            <Building2 className="w-12 h-12 text-forest-300 mx-auto mb-3" />
            <p className="text-charcoal-600 font-medium">No matching schemes found for your farm profile.</p>
            <p className="text-charcoal-500 text-sm mt-1">Try updating your farm area, crop, or location to find matching benefits.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((scheme, i) => (
              <SchemeCard key={(scheme as any).id || i} scheme={scheme as any} />
            ))}
          </div>
        )
      ) : (
        fpos.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-ivory-300">
            <Users className="w-12 h-12 text-forest-300 mx-auto mb-3" />
            {dataStatus === 'official_data_unavailable' ? (
              <>
                <p className="text-charcoal-600 font-medium">Verified FPO information is currently unavailable for this location.</p>
                <p className="text-charcoal-500 text-sm mt-1">FPO data is sourced from official government/authorized records.</p>
              </>
            ) : (
              <>
                <p className="text-charcoal-600 font-medium">No verified FPOs found nearby.</p>
                <p className="text-charcoal-500 text-sm mt-1">We couldn't find a verified FPO in the available official dataset for your location.</p>
              </>
            )}
            <Button variant="outline" size="sm" className="mt-4" onClick={handleRefresh}>Retry</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fpos.map((fpo, i) => (
              <FPOCard key={fpo.id || i} fpo={fpo} />
            ))}
          </div>
        )
      )}
    </div>
  );
};
