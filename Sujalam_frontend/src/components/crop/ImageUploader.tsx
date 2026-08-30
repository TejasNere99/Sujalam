import React, { useRef } from 'react';
import { Camera, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useLanguage } from '../../context/LanguageContext';

export interface ImageUploaderProps {
  onImageSelected: (imageDataOrUrl: string) => void;
  isAnalyzing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  isAnalyzing,
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelected(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleCottonLeafSpot = 'https://images.unsplash.com/photo-1599818816949-c1d48c8b6716?auto=format&fit=crop&w=800&q=80';
  const sampleHealthyLeaf = 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80';
  const sampleRustLeaf = 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-4">
      <Card
        variant="default"
        padding="lg"
        className="border-2 border-dashed border-forest-900/20 bg-ivory-100/50 hover:bg-white text-center transition-all"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          capture="environment"
          className="hidden"
        />

        <div className="max-w-md mx-auto py-6 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-forest-100 border border-forest-300 text-forest-900 mx-auto flex items-center justify-center shadow-subtle">
            <Camera className="w-8 h-8 text-forest-800" />
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-charcoal-950">
              {t.cropHealth.uploadPrompt}
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1 font-medium">
              {t.cropHealth.uploadSubprompt}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              isLoading={isAnalyzing}
              leftIcon={<Camera className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Take Photo / Upload Leaf
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Test Samples */}
      <div className="p-4 bg-white rounded-2xl border border-ivory-300">
        <span className="text-xs font-bold text-charcoal-600 block mb-2.5">
          {t.cropHealth.samplePhotos}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => onImageSelected(sampleCottonLeafSpot)}
            disabled={isAnalyzing}
            className="flex items-center gap-2.5 p-2.5 rounded-xl border border-amber-300 bg-amber-50/60 hover:bg-amber-100 text-left transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-charcoal-900">{t.cropHealth.sampleCottonSpot}</p>
              <p className="text-[10px] text-amber-900 font-semibold">Demo High-Risk Scenario</p>
            </div>
          </button>

          <button
            onClick={() => onImageSelected(sampleHealthyLeaf)}
            disabled={isAnalyzing}
            className="flex items-center gap-2.5 p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100 text-left transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-charcoal-900">{t.cropHealth.sampleCottonHealthy}</p>
              <p className="text-[10px] text-emerald-900 font-semibold">Healthy Control Sample</p>
            </div>
          </button>

          <button
            onClick={() => onImageSelected(sampleRustLeaf)}
            disabled={isAnalyzing}
            className="flex items-center gap-2.5 p-2.5 rounded-xl border border-ivory-300 bg-ivory-100 hover:bg-ivory-200 text-left transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-charcoal-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-charcoal-900">{t.cropHealth.sampleSoybeanRust}</p>
              <p className="text-[10px] text-charcoal-600">Rust Spore Sample</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
