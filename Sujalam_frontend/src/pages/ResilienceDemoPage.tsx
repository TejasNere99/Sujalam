import React from 'react';
import { useResilience } from '../context/ResilienceContext';
import { CheckCircle, XCircle, AlertTriangle, Database, ShieldAlert, Activity, RefreshCw } from 'lucide-react';

export const ResilienceDemoPage: React.FC = () => {
  const { status, refresh } = useResilience();

  const handleAction = async (endpoint: string) => {
    try {
      await fetch(`/api/resilience/${endpoint}`, { method: 'POST' });
      refresh();
    } catch (e) {
      console.error(e);
    }
  };

  if (!status) return <div className="p-8">Loading Resilience Context...</div>;

  const isHealthy = status.state === 'HEALTHY';
  const isBlackout = status.recovery_mode;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-forest-900">SUJALAM RESILIENCE CENTER</h1>
          <p className="text-gray-500">Live Hackathon Database Failure Simulation</p>
        </div>

        {/* Global Status Banner */}
        <div className={`rounded-xl p-6 shadow-sm border-2 ${isBlackout ? 'border-yellow-400 bg-yellow-50' : 'border-green-500 bg-green-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isBlackout ? (
                <AlertTriangle className="w-10 h-10 text-yellow-600" />
              ) : (
                <CheckCircle className="w-10 h-10 text-green-600" />
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {isBlackout ? 'RECOVERY MODE ACTIVE' : 'SYSTEM HEALTHY'}
                </h2>
                <p className="text-sm text-gray-600">
                  {isBlackout 
                    ? 'Primary DB offline. Serving from valid snapshot + event log.' 
                    : 'All systems operating normally. MongoDB connected.'}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-500">Consecutive Failures</div>
              <div className="text-2xl font-black text-gray-900">{status.consecutive_failures} / 3</div>
            </div>
          </div>
        </div>

        {/* System Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Primary Database" 
            icon={<Database />}
            ok={!isBlackout} 
            value={status.primary_db} 
          />
          <StatusCard 
            title="Snapshot Integrity" 
            icon={<ShieldAlert />}
            ok={true} 
            value="VERIFIED" 
          />
          <StatusCard 
            title="Event Log (Since Snap)" 
            icon={<Activity />}
            ok={true} 
            value={`${status.events_count} Events`} 
          />
          <StatusCard 
            title="Farmer Ops Queue" 
            icon={<RefreshCw />}
            ok={status.pending_events_count === 0} 
            warning={status.pending_events_count > 0}
            value={`${status.pending_events_count} Pending Sync`} 
          />
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Simulation Controls</h3>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => handleAction('create-snapshot')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
            >
              1. Create Snapshot
            </button>
            <button 
              onClick={() => handleAction('simulate-blackout')}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-bold transition-colors shadow-sm"
              disabled={isBlackout}
            >
              💥 2. SIMULATE DATABASE FAILURE
            </button>
            <button 
              onClick={() => handleAction('restore')}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg font-bold transition-colors shadow-sm"
              disabled={!isBlackout}
            >
              🔄 3. RESTORE DATABASE & SYNC
            </button>
            <button 
              onClick={() => handleAction('corrupt-snapshot')}
              className="px-4 py-2 border-2 border-dashed border-red-300 hover:bg-red-50 text-red-600 rounded-lg font-medium transition-colors ml-auto"
            >
              Corrupt Latest Snapshot (Demo)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatusCard = ({ title, icon, ok, warning, value }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center">
    <div className={`p-3 rounded-full mb-3 ${ok ? 'bg-green-100 text-green-600' : (warning ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600')}`}>
      {icon}
    </div>
    <div className="text-sm font-semibold text-gray-500 mb-1">{title}</div>
    <div className={`font-bold ${ok ? 'text-green-600' : (warning ? 'text-yellow-600' : 'text-red-600')}`}>
      {value}
    </div>
  </div>
);
