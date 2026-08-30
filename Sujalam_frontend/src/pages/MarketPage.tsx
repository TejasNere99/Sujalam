import React, { useState, useEffect } from 'react';
import { marketApi } from '../services/marketApi';
import { useFarm } from '../context/FarmContext';
import { MarketPrice } from '../services/types';
import { SellHoldCard } from '../components/market/SellHoldCard';
import { PriceTrend } from '../components/market/PriceTrend';
import { Skeleton } from '../components/ui/Skeleton';
import { useLanguage } from '../context/LanguageContext';
import { TrendingUp, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const MarketPage: React.FC = () => {
  const { t } = useLanguage();
  const { currentFarm, currentAdvisory } = useFarm();
  const farmId = currentFarm ? ((currentFarm as any).id || (currentFarm as any)._id) : null;

  const [market, setMarket] = useState<MarketPrice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadMarket = async (id: string) => {
    try {
      const res = await marketApi.getMarketPrice(id);
      setMarket(res);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load market data.');
    }
  };

  useEffect(() => {
    if (!farmId) return;
    setIsLoading(true);
    loadMarket(farmId).finally(() => setIsLoading(false));
  }, [farmId]);

  const handleRefresh = async () => {
    if (!farmId) return;
    setIsRefreshing(true);
    try {
      await loadMarket(farmId);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!farmId) {
    return (
      <div className="p-8 text-center">
        <p className="text-charcoal-500">No farm selected.</p>
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-96 w-full max-w-xl mx-auto rounded-3xl" />;
  }

  // SELL/HOLD comes EXCLUSIVELY from the backend advisory — never calculated in frontend
  const sellHoldDecision = currentAdvisory?.market?.decision || 'HOLD';
  const sellHoldReason = currentAdvisory?.market?.reason || 'Advisory not yet generated.';

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-950">{t.market.pageTitle}</h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">{t.market.pageSubtitle}</p>
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
          <button onClick={handleRefresh} className="ml-auto underline text-xs font-bold">Retry</button>
        </div>
      )}

      {!currentAdvisory && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          SELL/HOLD decision requires an advisory. Go to Dashboard and refresh your farm plan first.
        </div>
      )}

      <div className="max-w-2xl space-y-6">
        {/* SELL/HOLD from BACKEND ADVISORY — not frontend calculation */}
        <SellHoldCard
          market={market}
          recommendation={sellHoldDecision}
          reason={sellHoldReason}
        />

        {/* Price trend from API */}
        {market && <PriceTrend market={market} />}

        {market && (
          <div className="bg-white rounded-2xl border border-ivory-300 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-forest-800" />
              <h3 className="text-base font-bold text-charcoal-900">Price Details</h3>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Commodity', value: market.crop_name },
                { label: 'Market', value: market.market_name },
                { label: 'Current Price', value: `₹${market.price_per_quintal}/quintal` },
                { label: 'MSP', value: 'N/A' },
                { label: '7-Day Trend', value: market.trend_7d_percent != null ? `${market.trend_7d_percent > 0 ? '+' : ''}${market.trend_7d_percent}%` : '—' },
                { label: 'Source', value: market.source || 'Sujalam Market Feed' },
                { label: 'Updated', value: market.recorded_at || 'Recently' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-ivory-200 last:border-0">
                  <span className="text-charcoal-600 font-medium">{label}</span>
                  <span className="font-bold text-charcoal-900 text-right max-w-[200px]">{value || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
