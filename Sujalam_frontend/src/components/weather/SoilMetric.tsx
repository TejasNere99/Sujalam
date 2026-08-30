import React from 'react';
import { Droplets, Gauge, Activity, ShieldCheck, Thermometer } from 'lucide-react';
import { SoilReading } from '../../services/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useLanguage } from '../../context/LanguageContext';

export interface SoilMetricProps {
  soil: SoilReading;
}

export const SoilMetric: React.FC<SoilMetricProps> = ({ soil }) => {
  const { t } = useLanguage();

  if (!soil) {
    return (
      <Card variant="default" padding="lg" className="flex flex-col items-center justify-center py-12 text-charcoal-400">
        <Droplets className="w-8 h-8 mb-3 opacity-50" />
        <p className="text-sm font-medium">No soil data recorded yet.</p>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="lg" className="space-y-5">
      <div className="flex items-center justify-between gap-2 pb-4 border-b border-ivory-300">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-forest-50 text-forest-800 border border-forest-200">
            <Droplets className="w-5 h-5 text-forest-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-charcoal-950">{t.weatherSoil.soilTelemetry}</h3>
            <p className="text-xs text-charcoal-500">Root-zone capacitive moisture sensor Plot #2</p>
          </div>
        </div>

        <Badge variant="success" size="md">
          {t.weatherSoil.soilMoistureStatusLabel}
        </Badge>
      </div>

      {/* Main Soil Moisture Gauge */}
      <div className="p-4 rounded-2xl bg-ivory-100/80 border border-ivory-300 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-4xl font-extrabold text-forest-900 font-sans">
            {soil.moisture_percent}%
          </div>
          <div>
            <span className="text-sm font-bold text-charcoal-900 block">Root-Zone Available Moisture</span>
            <span className="text-xs text-forest-800 font-medium">Sufficient for Flowering stage • No irrigation required</span>
          </div>
        </div>

        <div className="w-full sm:w-48 bg-ivory-300 h-3 rounded-full overflow-hidden">
          <div
            className="bg-forest-600 h-full rounded-full transition-all duration-700"
            style={{ width: `${soil.moisture_percent}%` }}
          />
        </div>
      </div>

      {/* Soil Nutrients Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white border border-ivory-300">
          <span className="text-charcoal-500 font-bold uppercase">{t.weatherSoil.soilPh}</span>
          <p className="text-base font-extrabold text-charcoal-900 mt-0.5">{soil.ph} (Neutral)</p>
        </div>

        <div className="p-3 rounded-xl bg-white border border-ivory-300">
          <span className="text-charcoal-500 font-bold uppercase">{t.weatherSoil.nitrogen}</span>
          <p className="text-xs font-bold text-forest-900 mt-0.5">{soil.nitrogen}</p>
        </div>

        <div className="p-3 rounded-xl bg-white border border-ivory-300">
          <span className="text-charcoal-500 font-bold uppercase">{t.weatherSoil.phosphorus}</span>
          <p className="text-xs font-bold text-forest-900 mt-0.5">{soil.phosphorus}</p>
        </div>

        <div className="p-3 rounded-xl bg-white border border-ivory-300">
          <span className="text-charcoal-500 font-bold uppercase">{t.weatherSoil.groundwater}</span>
          <p className="text-xs font-bold text-charcoal-900 mt-0.5">{soil.groundwater_level}</p>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-charcoal-500 flex items-center justify-between border-t border-ivory-200">
        <span>Source: {soil.source}</span>
        <span>Sensor: Wireless LoRaWAN Node</span>
      </div>
    </Card>
  );
};
