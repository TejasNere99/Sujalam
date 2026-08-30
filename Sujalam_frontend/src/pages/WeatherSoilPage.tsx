import React, { useState, useEffect } from 'react';
import { weatherApi } from '../services/weatherApi';
import { useFarm } from '../context/FarmContext';
import { WeatherSnapshot, SoilReading } from '../services/types';
import { WeatherSummary } from '../components/weather/WeatherSummary';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { RefreshCw, Plus, CheckCircle2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

export const WeatherSoilPage: React.FC = () => {
  const { t } = useLanguage();
  const { currentFarm } = useFarm();
  const farmId = currentFarm ? ((currentFarm as any).id || (currentFarm as any)._id) : null;

  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [soil, setSoil] = useState<SoilReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddingSoil, setIsAddingSoil] = useState(false);
  const [soilModalOpen, setSoilModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  const [soilForm, setSoilForm] = useState({
    moisture_percent: '',
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    groundwater_level: '',
    source: 'manual' as 'manual' | 'sensor' | 'simulated',
  });

  const getFarmId = () => farmId;

  const loadData = async (id: string) => {
    try {
      const [weatherRes, soilRes] = await Promise.allSettled([
        weatherApi.getWeather(id),
        weatherApi.getSoil(id),
      ]);
      if (weatherRes.status === 'fulfilled') setWeather(weatherRes.value);
      if (soilRes.status === 'fulfilled') setSoil(soilRes.value);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!farmId) return;
    setIsLoading(true);
    loadData(farmId).finally(() => setIsLoading(false));
  }, [farmId]);

  const handleRefreshWeather = async () => {
    if (!farmId) return;
    setIsRefreshing(true);
    try {
      const refreshed = await weatherApi.refreshWeather(farmId);
      setWeather(refreshed);
      setSaveSuccess('Weather data refreshed.');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (e: any) {
      setSaveError(e.message || 'Failed to refresh weather.');
      setTimeout(() => setSaveError(''), 4000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddSoil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId) return;
    setSaveError('');
    setIsAddingSoil(true);
    try {
      const reading: any = {};
      if (soilForm.moisture_percent) reading.moisture_percent = Number(soilForm.moisture_percent);
      if (soilForm.ph) reading.ph = Number(soilForm.ph);
      if (soilForm.nitrogen) reading.nitrogen = Number(soilForm.nitrogen);
      if (soilForm.phosphorus) reading.phosphorus = Number(soilForm.phosphorus);
      if (soilForm.potassium) reading.potassium = Number(soilForm.potassium);
      if (soilForm.groundwater_level) reading.groundwater_level = Number(soilForm.groundwater_level);
      reading.source = soilForm.source;

      const updated = await weatherApi.addSoilReading(farmId, reading);
      setSoil(updated);
      setSoilModalOpen(false);
      setSaveSuccess('Soil reading saved.');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (e: any) {
      setSaveError(e.message || 'Failed to save soil reading.');
    } finally {
      setIsAddingSoil(false);
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
    return (
      <div className="space-y-6">
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-44 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-950">{t.weatherSoil.pageTitle}</h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">{t.weatherSoil.pageSubtitle}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSoilModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Soil Reading
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleRefreshWeather}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            disabled={isRefreshing}
          >
            Refresh
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {saveSuccess}
        </div>
      )}
      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {saveError}
        </div>
      )}

      {weather || soil ? (
        <WeatherSummary
          weather={weather as WeatherSnapshot}
          soil={soil as SoilReading}
          forecast={[]}
        />
      ) : (
        <div className="p-8 text-center bg-white rounded-3xl border border-ivory-300">
          <p className="text-charcoal-500 font-medium mb-4">No weather or soil data available yet.</p>
          <Button onClick={handleRefreshWeather} isLoading={isRefreshing} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Fetch Weather Data
          </Button>
        </div>
      )}

      {/* Add Soil Reading Modal */}
      <Modal
        isOpen={soilModalOpen}
        onClose={() => { setSoilModalOpen(false); setSaveError(''); }}
        title="Add Soil Reading"
        subtitle="Record current soil measurements for your farm."
        maxWidth="md"
      >
        <form onSubmit={handleAddSoil} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'moisture_percent', label: 'Moisture %', placeholder: '35', min: 0, max: 100 },
              { key: 'ph', label: 'pH Level', placeholder: '7.2', min: 0, max: 14, step: 0.1 },
              { key: 'nitrogen', label: 'Nitrogen (kg/ha)', placeholder: '50' },
              { key: 'phosphorus', label: 'Phosphorus (kg/ha)', placeholder: '30' },
              { key: 'potassium', label: 'Potassium (kg/ha)', placeholder: '40' },
              { key: 'groundwater_level', label: 'Groundwater (m)', placeholder: '5.5', step: 0.1 },
            ].map(({ key, label, placeholder, min, max, step }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">{label}</label>
                <input
                  type="number"
                  step={step || '1'}
                  min={min}
                  max={max}
                  placeholder={placeholder}
                  value={(soilForm as any)[key]}
                  onChange={(e) => setSoilForm({ ...soilForm, [key]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">Source</label>
            <select
              value={soilForm.source}
              onChange={(e) => setSoilForm({ ...soilForm, source: e.target.value as any })}
              className="w-full px-3 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white"
            >
              <option value="manual">Manual Reading</option>
              <option value="sensor">Sensor</option>
              <option value="simulated">Simulated</option>
            </select>
          </div>

          {saveError && <p className="text-xs text-red-600 font-medium">{saveError}</p>}

          <div className="pt-4 border-t border-ivory-300 flex justify-end gap-2.5">
            <Button type="button" variant="secondary" size="md" onClick={() => { setSoilModalOpen(false); setSaveError(''); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isAddingSoil}>
              Save Reading
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
