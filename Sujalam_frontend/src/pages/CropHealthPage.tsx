import React, { useState, useEffect, useRef } from 'react';
import { cropHealthApi } from '../services/cropHealthApi';
import { useFarm } from '../context/FarmContext';
import { CropHealth } from '../services/types';
import { Skeleton } from '../components/ui/Skeleton';
import { useLanguage } from '../context/LanguageContext';
import { Scan, Upload, Camera, CheckCircle2, AlertTriangle, RefreshCw, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 10;

export const CropHealthPage: React.FC = () => {
  const { t } = useLanguage();
  const { currentFarm, refreshAdvisory } = useFarm();
  const farmId = currentFarm ? ((currentFarm as any).id || (currentFarm as any)._id) : null;

  const [latestHealth, setLatestHealth] = useState<CropHealth | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CropHealth | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!farmId) return;
    setIsLoadingInitial(true);
    cropHealthApi.getLatestHealth(farmId)
      .then(res => setLatestHealth(res))
      .catch(() => setLatestHealth(null))
      .finally(() => setIsLoadingInitial(false));
  }, [farmId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    // Validate size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    setError('');
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!farmId || !previewUrl) return;
    setIsAnalyzing(true);
    setError('');
    try {
      // Send base64 image URL to backend for analysis
      const result = await cropHealthApi.analyzeImage(farmId, previewUrl);
      setAnalysisResult(result);
      setLatestHealth(result);
      setSuccess('Analysis complete. Your farm plan has been updated.');
      // Refresh advisory since crop health changed
      await refreshAdvisory().catch(() => {});
      setTimeout(() => setSuccess(''), 4000);
    } catch (e: any) {
      setError(e.message || 'Crop analysis is temporarily unavailable. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'needs_attention': return 'warning';
      case 'high_risk': return 'danger';
      default: return 'info';
    }
  };

  const getHealthLabel = (status: string) => {
    switch (status) {
      case 'healthy': return 'Healthy';
      case 'needs_attention': return 'Needs Attention';
      case 'high_risk': return 'High Risk';
      default: return 'Unknown';
    }
  };

  if (!farmId) {
    return <div className="p-8 text-center"><p className="text-charcoal-500">No farm selected.</p></div>;
  }

  if (isLoadingInitial) {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  const displayResult = analysisResult || latestHealth;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-950">{t.cropHealth.pageTitle}</h2>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-1">{t.cropHealth.pageSubtitle}</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {success}
        </div>
      )}

      {/* Upload + Preview Section */}
      <Card variant="default" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-forest-800" />
            <h3 className="text-base font-bold text-charcoal-900">Upload Leaf Image</h3>
          </div>
          <span className="text-xs text-charcoal-500">JPG, PNG, WEBP · Max {MAX_SIZE_MB}MB</span>
        </div>

        {!previewUrl ? (
          <div
            className="border-2 border-dashed border-ivory-400 rounded-2xl p-8 text-center cursor-pointer hover:border-forest-500 hover:bg-forest-50/30 transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-12 h-12 text-forest-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-charcoal-700 mb-1">Click to upload a leaf photo</p>
            <p className="text-xs text-charcoal-500">Take a clear photo of the affected leaf for best results</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="leaf-upload"
            />
            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              Choose Image
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Selected leaf"
                className="w-full max-h-64 object-cover rounded-xl border border-ivory-300"
              />
              <button
                onClick={handleReset}
                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full border border-ivory-300 flex items-center justify-center hover:bg-red-50 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4 text-charcoal-600" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {isAnalyzing ? (
              <div className="text-center py-4">
                <div className="w-10 h-10 border-4 border-forest-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-bold text-charcoal-900">{t.cropHealth.analyzingText}</p>
                <p className="text-xs text-charcoal-500 mt-1">Matching patterns against pathology datasets...</p>
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleAnalyze}
                leftIcon={<Scan className="w-5 h-5" />}
              >
                Analyze Crop Health
              </Button>
            )}
          </div>
        )}

        {error && !previewUrl && (
          <p className="text-xs text-red-600 font-medium mt-2">{error}</p>
        )}
      </Card>

      {/* Analysis / Latest Result */}
      {displayResult && (
        <Card variant="default" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-forest-800" />
              <h3 className="text-base font-bold text-charcoal-900">
                {analysisResult ? 'Analysis Result' : 'Latest Diagnosis'}
              </h3>
            </div>
            <Badge variant={getHealthColor(displayResult.health_status) as any}>
              {getHealthLabel(displayResult.health_status)}
            </Badge>
          </div>

          <div className="space-y-3 text-sm">
            {displayResult.disease_name && (
              <div className="flex justify-between py-1.5 border-b border-ivory-200">
                <span className="text-charcoal-600 font-medium">Detected Condition</span>
                <span className="font-bold text-red-700">{displayResult.disease_name}</span>
              </div>
            )}
            {displayResult.disease_probability != null && (
              <div className="flex justify-between py-1.5 border-b border-ivory-200">
                <span className="text-charcoal-600 font-medium">Disease Probability</span>
                <span className="font-bold text-charcoal-900">{displayResult.disease_probability}%</span>
              </div>
            )}
            {displayResult.recommended_action && (
              <div className="flex justify-between py-1.5 border-b border-ivory-200">
                <span className="text-charcoal-600 font-medium">Recommended Action</span>
                <span className="font-bold text-forest-900 text-right max-w-[200px]">{displayResult.recommended_action}</span>
              </div>
            )}
            {displayResult.source && (
              <div className="flex justify-between py-1.5 border-b border-ivory-200">
                <span className="text-charcoal-600 font-medium">Source</span>
                <span className="font-medium text-charcoal-700">{displayResult.source}</span>
              </div>
            )}
            {displayResult.created_at && (
              <div className="flex justify-between py-1.5">
                <span className="text-charcoal-600 font-medium">Recorded At</span>
                <span className="text-charcoal-700">{new Date(displayResult.created_at).toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-ivory-200 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              New Scan
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
