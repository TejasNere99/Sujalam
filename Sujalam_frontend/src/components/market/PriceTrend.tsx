import React from 'react';
import { TrendingUp, Building2, MapPin } from 'lucide-react';
import { MarketPrice } from '../../services/types';
import { Card } from '../ui/Card';
import { formatINR } from '../../lib/utils';
import { useLanguage } from '../../context/LanguageContext';

export interface PriceTrendProps {
  market: any;
}

export const PriceTrend: React.FC<PriceTrendProps> = ({ market }) => {
  const { t } = useLanguage();

  const basePrice = market.price_per_quintal || 7100;
  const baseMarket = market.market_name || 'Local APMC';
  const baseTrend = market.trend_7d_percent != null ? `${market.trend_7d_percent > 0 ? '+' : ''}${market.trend_7d_percent}%` : '+4.2%';

  const nearbyMandis = [
    { name: baseMarket, distance: '8 km', rate: basePrice, trend: baseTrend, active: true },
    { name: 'Darwha APMC', distance: '22 km', rate: basePrice - 40, trend: '+3.8%', active: false },
    { name: 'Wani APMC', distance: '54 km', rate: basePrice - 80, trend: '+2.5%', active: false },
    { name: 'Amravati APMC', distance: '85 km', rate: basePrice + 40, trend: '+4.5%', active: false },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 7-Day Price History Card */}
      <Card variant="default" padding="lg" className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-ivory-300">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-forest-800" />
            <h3 className="text-base sm:text-lg font-bold text-charcoal-900">
              {t.market.priceHistory7Day}
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            +₹290 / quintal
          </span>
        </div>

        {/* Minimalist Bar Trend Representation */}
        <div className="space-y-2.5 pt-2">
          {market.history?.map((item: any, idx: any) => {
            const min = 6700;
            const max = 7300;
            const percent = ((item.price - min) / (max - min)) * 100;
            const isToday = idx === (market.history?.length ?? 1) - 1;

            return (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <span className={`w-14 font-semibold ${isToday ? 'text-forest-900 font-bold' : 'text-charcoal-500'}`}>
                  {item.date}
                </span>

                <div className="flex-1 bg-ivory-200 h-6 rounded-lg overflow-hidden relative flex items-center px-2">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-lg transition-all ${
                      isToday ? 'bg-forest-800' : 'bg-forest-600/70'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                  <span className={`relative z-10 font-bold ${percent > 40 ? 'text-white' : 'text-charcoal-900'}`}>
                    {formatINR(item.price)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Nearby Mandi Comparisons */}
      <Card variant="default" padding="lg" className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-ivory-300">
          <Building2 className="w-5 h-5 text-forest-800" />
          <h3 className="text-base sm:text-lg font-bold text-charcoal-900">
            {t.market.nearbyMandis}
          </h3>
        </div>

        <div className="space-y-2.5 pt-1">
          {nearbyMandis.map((mandi, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                mandi.active
                  ? 'bg-forest-50 border-forest-300 shadow-subtle'
                  : 'bg-ivory-100/70 border-ivory-300'
              }`}
            >
              <div>
                <p className="text-sm font-bold text-charcoal-900 flex items-center gap-1.5">
                  <span>{mandi.name}</span>
                  {mandi.active && (
                    <span className="text-[10px] bg-forest-900 text-white px-1.5 py-0.5 rounded-md font-bold">
                      Nearest
                    </span>
                  )}
                </p>
                <p className="text-xs text-charcoal-500 mt-0.5">{mandi.distance}</p>
              </div>

              <div className="text-right">
                <p className="text-base font-extrabold text-charcoal-900 font-sans">
                  {formatINR(mandi.rate)}
                </p>
                <p className="text-xs font-bold text-emerald-700">{mandi.trend}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
