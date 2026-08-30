import React from 'react';
import { CloudRain, Sun, CloudSun, Calendar } from 'lucide-react';
import { WeatherSnapshot, SoilReading, WeatherDailyForecast } from '../../services/types';
import { RainRisk } from './RainRisk';
import { SoilMetric } from './SoilMetric';
import { Card } from '../ui/Card';
import { useLanguage } from '../../context/LanguageContext';

export interface WeatherSummaryProps {
  weather: WeatherSnapshot;
  soil: SoilReading;
  forecast: WeatherDailyForecast[];
}

export const WeatherSummary: React.FC<WeatherSummaryProps> = ({ weather, soil, forecast }) => {
  const { t } = useLanguage();

  const getForecastIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'CloudSun':
        return <CloudSun className="w-5 h-5 text-amber-600" />;
      default:
        return <Sun className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Impact Weather Risk Alert */}
      <RainRisk weather={weather} />

      {/* 2. Root-Zone Soil Telemetry */}
      <SoilMetric soil={soil} />

      {/* 3. 7-Day Agricultural Forecast */}
      <Card variant="default" padding="lg">
        <div className="flex items-center gap-2 pb-4 border-b border-ivory-300">
          <Calendar className="w-5 h-5 text-forest-800" />
          <h3 className="text-base sm:text-lg font-bold text-charcoal-900">
            {t.weatherSoil.forecast7Day}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4">
          {forecast.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-center flex flex-col justify-between items-center transition-all ${
                idx === 0
                  ? 'bg-forest-50 border-forest-300 shadow-subtle'
                  : 'bg-ivory-100/60 border-ivory-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-charcoal-900 block">{item.day}</span>
                <span className="text-[11px] text-charcoal-500 block">{item.date}</span>
              </div>

              <div className="my-2.5 p-2 rounded-xl bg-white shadow-subtle border border-ivory-200">
                {getForecastIcon(item.icon)}
              </div>

              <div className="w-full">
                <div className="text-xs font-extrabold text-charcoal-900">
                  {item.temp_max}° / <span className="text-charcoal-500">{item.temp_min}°</span>
                </div>
                <div className="text-[11px] font-bold text-blue-700 mt-1">
                  💧 {item.rain_prob}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
