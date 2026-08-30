import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Farm, FarmCrop } from '../services/types';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { Sprout, Layers, MapPin, Droplets, Calendar, CheckCircle2, Plus, Edit2 } from 'lucide-react';

export const MyFarmPage: React.FC = () => {
  const { t } = useLanguage();
  const { currentFarm, currentCrop, farms, isLoadingFarm, updateFarm, updateCrop, refreshFarm } = useFarm();

  const [isEditFarmOpen, setIsEditFarmOpen] = useState(false);
  const [isEditCropOpen, setIsEditCropOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const [farmForm, setFarmForm] = useState({
    name: currentFarm?.name || '',
    location_name: currentFarm?.location_name || '',
    area_acres: currentFarm?.area_acres || 0,
    soil_type: currentFarm?.soil_type || '',
    irrigation_type: currentFarm?.irrigation_type || '',
  });

  const [cropForm, setCropForm] = useState({
    crop_name: currentCrop?.crop_name || '',
    variety: currentCrop?.variety || '',
    sowing_date: currentCrop?.sowing_date || '',
    growth_stage: currentCrop?.growth_stage || '',
  });

  // Sync form when farm/crop loads
  React.useEffect(() => {
    if (currentFarm) {
      setFarmForm({
        name: currentFarm.name || '',
        location_name: currentFarm.location_name || '',
        area_acres: currentFarm.area_acres || 0,
        soil_type: currentFarm.soil_type || '',
        irrigation_type: currentFarm.irrigation_type || '',
      });
    }
  }, [currentFarm]);

  React.useEffect(() => {
    if (currentCrop) {
      setCropForm({
        crop_name: currentCrop.crop_name || '',
        variety: currentCrop.variety || '',
        sowing_date: currentCrop.sowing_date || '',
        growth_stage: currentCrop.growth_stage || '',
      });
    }
  }, [currentCrop]);

  const showSuccess = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handleSaveFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    if (!farmForm.name.trim()) { setSaveError('Farm name is required.'); return; }
    if (Number(farmForm.area_acres) <= 0) { setSaveError('Area must be greater than 0.'); return; }
    setIsSaving(true);
    try {
      await updateFarm({
        name: farmForm.name,
        location_name: farmForm.location_name,
        area_acres: Number(farmForm.area_acres),
        soil_type: farmForm.soil_type,
        irrigation_type: farmForm.irrigation_type,
      });
      setIsEditFarmOpen(false);
      showSuccess('Farm updated successfully.');
    } catch (e: any) {
      setSaveError(e.message || 'Failed to save farm. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    if (!cropForm.crop_name.trim()) { setSaveError('Crop name is required.'); return; }
    setIsSaving(true);
    try {
      await updateCrop({
        crop_name: cropForm.crop_name,
        variety: cropForm.variety,
        sowing_date: cropForm.sowing_date,
        growth_stage: cropForm.growth_stage,
      });
      setIsEditCropOpen(false);
      showSuccess('Crop updated successfully. Advisory refreshed.');
    } catch (e: any) {
      setSaveError(e.message || 'Failed to save crop. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingFarm) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (farms.length === 0 || !currentFarm) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-ivory-300 shadow-sm text-center mt-8">
        <Sprout className="w-16 h-16 text-forest-300 mb-4" />
        <h2 className="text-xl font-bold text-charcoal-900 mb-2">No Farm Found</h2>
        <p className="text-sm text-charcoal-600 mb-6 max-w-md">Complete the onboarding wizard to set up your farm.</p>
        <Button onClick={() => window.location.href = '/onboarding'} rightIcon={<Plus className="w-4 h-4" />}>
          Set Up Farm
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-950">{t.farm.pageTitle}</h2>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-1">{t.farm.pageSubtitle}</p>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {saveSuccess}
        </div>
      )}

      {/* Farm Summary */}
      <Card variant="default" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-charcoal-900">{currentFarm.name}</h3>
              <p className="text-xs text-charcoal-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {currentFarm.location_name || 'Location not set'}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditFarmOpen(true)}
            leftIcon={<Edit2 className="w-4 h-4" />}
          >
            Edit Farm
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-ivory-200">
          <div className="text-center">
            <p className="text-xs text-charcoal-500 mb-1">Area</p>
            <p className="text-lg font-extrabold text-forest-900">{currentFarm.area_acres}</p>
            <p className="text-xs text-charcoal-500">Acres</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-charcoal-500 mb-1">Soil Type</p>
            <p className="text-sm font-bold text-charcoal-900 leading-tight">{currentFarm.soil_type || '—'}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-charcoal-500 mb-1">Irrigation</p>
            <p className="text-sm font-bold text-charcoal-900 leading-tight">{currentFarm.irrigation_type || '—'}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-charcoal-500 mb-1">Coordinates</p>
            <p className="text-xs font-mono text-charcoal-700">
              {currentFarm.latitude ? `${currentFarm.latitude}°N` : '—'}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Crop Card */}
        <Card variant="default" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-forest-800" />
              <h3 className="text-base font-bold text-charcoal-900">{t.farm.cropDetails}</h3>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditCropOpen(true)}
              leftIcon={<Edit2 className="w-4 h-4" />}
            >
              {currentCrop ? 'Edit' : 'Add Crop'}
            </Button>
          </div>

          {currentCrop ? (
            <div className="space-y-3 text-sm">
              {[
                { label: 'Crop', value: currentCrop.crop_name },
                { label: t.farm.variety, value: currentCrop.variety },
                { label: t.farm.sowingDate, value: currentCrop.sowing_date },
                { label: t.farm.growthStage, value: currentCrop.growth_stage },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-ivory-200 last:border-0">
                  <span className="text-charcoal-600 font-medium">{label}</span>
                  <span className="font-bold text-charcoal-900 text-right max-w-[180px]">{value || '—'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Sprout className="w-10 h-10 text-forest-300 mx-auto mb-2" />
              <p className="text-sm text-charcoal-500">No crop registered yet.</p>
              <Button
                variant="primary"
                size="sm"
                className="mt-3"
                onClick={() => setIsEditCropOpen(true)}
              >
                Add Crop
              </Button>
            </div>
          )}
        </Card>

        {/* Farm Details */}
        <Card variant="default" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-5 h-5 text-forest-800" />
            <h3 className="text-base font-bold text-charcoal-900">{t.farm.farmDetails}</h3>
          </div>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Farm Name', value: currentFarm.name },
              { label: t.farm.landArea, value: `${currentFarm.area_acres} Acres` },
              { label: t.farm.soilType, value: currentFarm.soil_type },
              { label: t.farm.irrigationSource, value: currentFarm.irrigation_type },
              { label: 'Location', value: currentFarm.location_name },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-ivory-200 last:border-0">
                <span className="text-charcoal-600 font-medium">{label}</span>
                <span className="font-bold text-charcoal-900 text-right max-w-[180px]">{value || '—'}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Edit Farm Modal */}
      <Modal
        isOpen={isEditFarmOpen}
        onClose={() => { setIsEditFarmOpen(false); setSaveError(''); }}
        title={t.farm.editFarm}
        subtitle="Changes will be saved to MongoDB and your advisory refreshed."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveFarm} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">Farm Name *</label>
              <input
                type="text"
                value={farmForm.name}
                onChange={(e) => setFarmForm({ ...farmForm, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">{t.onboarding.acresLabel} *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={farmForm.area_acres}
                onChange={(e) => setFarmForm({ ...farmForm, area_acres: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">Location / Village</label>
            <input
              type="text"
              value={farmForm.location_name}
              onChange={(e) => setFarmForm({ ...farmForm, location_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">{t.farm.soilType}</label>
              <select
                value={farmForm.soil_type}
                onChange={(e) => setFarmForm({ ...farmForm, soil_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white"
              >
                <option value="">Select soil type</option>
                <option value="Medium to Deep Black Cotton Soil (Regur)">Black Cotton Soil (Regur)</option>
                <option value="Red Sandy Loam Soil">Red Sandy Loam Soil</option>
                <option value="Alluvial Soil">Alluvial Soil</option>
                <option value="Laterite Soil">Laterite Soil</option>
                <option value="Sandy Loam">Sandy Loam</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">{t.farm.irrigationSource}</label>
              <select
                value={farmForm.irrigation_type}
                onChange={(e) => setFarmForm({ ...farmForm, irrigation_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white"
              >
                <option value="">Select irrigation type</option>
                <option value="Borewell with Micro-Drip System">Borewell + Drip</option>
                <option value="Canal Water Flow">Canal Water Flow</option>
                <option value="Open Well & Sprinkler">Open Well + Sprinkler</option>
                <option value="Rainfed (Monsoon Only)">Rainfed (Monsoon Only)</option>
              </select>
            </div>
          </div>

          {saveError && <p className="text-xs text-red-600 font-medium">{saveError}</p>}

          <div className="pt-4 border-t border-ivory-300 flex justify-end gap-2.5">
            <Button type="button" variant="secondary" size="md" onClick={() => { setIsEditFarmOpen(false); setSaveError(''); }}>
              {t.farm.cancel}
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
              {t.farm.saveChanges}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Crop Modal */}
      <Modal
        isOpen={isEditCropOpen}
        onClose={() => { setIsEditCropOpen(false); setSaveError(''); }}
        title={currentCrop ? 'Edit Crop' : 'Add Crop'}
        subtitle="Your farm plan will be refreshed after saving."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveCrop} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">Crop Name *</label>
              <input
                type="text"
                value={cropForm.crop_name}
                onChange={(e) => setCropForm({ ...cropForm, crop_name: e.target.value })}
                placeholder="Cotton, Wheat, Soybean..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">{t.farm.variety}</label>
              <input
                type="text"
                value={cropForm.variety}
                onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })}
                placeholder="Bt Cotton RCH-659..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">{t.farm.sowingDate}</label>
              <input
                type="date"
                value={cropForm.sowing_date}
                onChange={(e) => setCropForm({ ...cropForm, sowing_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1">{t.farm.growthStage}</label>
              <select
                value={cropForm.growth_stage}
                onChange={(e) => setCropForm({ ...cropForm, growth_stage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-400 bg-ivory-50 text-sm font-semibold focus:bg-white"
              >
                <option value="">Select stage</option>
                <option value="Germination">Germination</option>
                <option value="Seedling">Seedling</option>
                <option value="Vegetative">Vegetative</option>
                <option value="Flowering & Boll Formation">Flowering & Boll Formation</option>
                <option value="Boll Development">Boll Development</option>
                <option value="Maturity">Maturity</option>
                <option value="Harvesting">Harvesting</option>
              </select>
            </div>
          </div>

          {saveError && <p className="text-xs text-red-600 font-medium">{saveError}</p>}

          <div className="pt-4 border-t border-ivory-300 flex justify-end gap-2.5">
            <Button type="button" variant="secondary" size="md" onClick={() => { setIsEditCropOpen(false); setSaveError(''); }}>
              {t.farm.cancel}
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isSaving} leftIcon={<Calendar className="w-4 h-4" />}>
              {t.farm.saveChanges}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
