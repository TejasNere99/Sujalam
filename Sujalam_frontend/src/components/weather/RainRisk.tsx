import React from 'react';
import { CloudRain, AlertTriangle, Droplets, Info } from 'lucide-react';
import { WeatherSnapshot } from '../../services/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useLanguage } from '../../context/LanguageContext';

export interface RainRiskProps {
  weather: WeatherSnapshot;
}

export const RainRisk: React.FC<RainRiskProps> = ({ weather }) => {
  const { t } = useLanguage();

  return (
    <Card variant="forest" padding="lg" className="relative overflow-hidden">
      <div className="relative z-10 space-y-4">
        {/* Header Tag */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-300">
              {t.weatherSoil.impactHeader}
            </span>
          </div>

          <Badge variant="warning" size="md">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            {t.weatherSoil.rainRiskHigh} ({weather.rain_probability_percent}%)
          </Badge>
        </div>

        {/* Big Impact Headline */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Heavy Rain Expected within 24 Hours
          </h2>
          <p className="text-sm sm:text-base text-forest-200 mt-1.5 font-medium leading-relaxed max-w-2xl">
            {t.weatherSoil.rainRiskDesc}
          </p>
        </div>

        {/* Primary Weather Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-forest-800">
          <div className="p-3 rounded-xl bg-forest-800/80 border border-forest-700">
            <span className="text-[11px] text-forest-300 font-bold uppercase">{t.weatherSoil.tempNow}</span>
            <p className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">{weather.temperature_c}°C</p>
          </div>

          <div className="p-3 rounded-xl bg-forest-800/80 border border-forest-700">
            <span className="text-[11px] text-forest-300 font-bold uppercase">{t.weatherSoil.rainfallExpected}</span>
            <p className="text-xl sm:text-2xl font-extrabold text-gold-300 mt-0.5">{weather.rainfall_mm} mm</p>
          </div>

          <div className="p-3 rounded-xl bg-forest-800/80 border border-forest-700">
            <span className="text-[11px] text-forest-300 font-bold uppercase">{t.weatherSoil.humidity}</span>
            <p className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">{weather.humidity_percent}%</p>
          </div>

          <div className="p-3 rounded-xl bg-forest-800/80 border border-forest-700">
            <span className="text-[11px] text-forest-300 font-bold uppercase">{t.weatherSoil.windSpeed}</span>
            <p className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">{weather.wind_kmh} km/h</p>
          </div>
        </div>

        {/* Data Provenance Footer */}
        <div className="pt-2 text-[11px] text-forest-400 flex items-center justify-between">
          <span>Source: {weather.source}</span>
          <span>Updated: Today 06:20 AM</span>
        </div>
      </div>
    </Card>
  );
};
