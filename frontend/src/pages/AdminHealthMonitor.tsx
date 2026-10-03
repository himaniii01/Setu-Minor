import React, { useState, useEffect } from 'react';
import { Shield, Activity, AlertTriangle, RefreshCw, Power, Server } from 'lucide-react';
import api from '../services/api';
import { APIRegistry } from '../types';
import { useToast } from '../context/ToastContext';

export const AdminHealthMonitor: React.FC = () => {
  const { showToast } = useToast();
  const [metrics, setMetrics] = useState<any>(null);
  const [apis, setApis] = useState<APIRegistry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      const resHealth = await api.get('/admin/connectors/health');
      setMetrics(resHealth.data.metrics);
      
      const resApis = await api.get('/admin/apis');
      setApis(resApis.data.apis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFailure = async (apiId: string, currentSim: boolean) => {
    setTogglingId(apiId);
    try {
      const res = await api.patch(`/admin/apis/${apiId}`, {
        simulate_failure: !currentSim,
        health: !currentSim ? 'DEGRADED' : 'HEALTHY'
      });
      showToast(
        'Connector Toggle Updated',
        `Failure simulation turned ${!currentSim ? 'ON (Simulating Timeout)' : 'OFF (Healthy)'} for ${res.data.api.service_name}`,
        !currentSim ? 'warning' : 'success'
      );
      fetchHealthData();
    } catch (err: any) {
      showToast('Error', 'Failed to update connector simulation', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6ECF4] pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0B2A5B] tracking-tight">Interoperability Health Monitor</h1>
          <p className="text-slate-500 text-sm mt-1">Admin suite for live gateway metrics and connector failure resilience testing</p>
        </div>

        <button
          onClick={fetchHealthData}
          className="bg-slate-100 hover:bg-slate-200 text-[#0F1F3D] px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white border border-[#E6ECF4] p-5 rounded-2xl shadow-soft space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Gateway Calls</span>
            <p className="text-3xl font-extrabold text-[#0F1F3D]">{metrics.totalGatewayCalls}</p>
          </div>

          <div className="bg-white border border-[#E6ECF4] p-5 rounded-2xl shadow-soft space-y-1">
            <span className="text-xs font-bold text-emerald-600 uppercase">Success Rate</span>
            <p className="text-3xl font-extrabold text-emerald-600">{metrics.overallSuccessRate}</p>
          </div>

          <div className="bg-white border border-[#E6ECF4] p-5 rounded-2xl shadow-soft space-y-1">
            <span className="text-xs font-bold text-rose-500 uppercase">Gateway Timeouts / Failures</span>
            <p className="text-3xl font-extrabold text-rose-600">{metrics.failureCount}</p>
          </div>

          <div className="bg-white border border-[#E6ECF4] p-5 rounded-2xl shadow-soft space-y-1">
            <span className="text-xs font-bold text-blue-600 uppercase">Active Connectors</span>
            <p className="text-3xl font-extrabold text-[#0B2A5B]">{metrics.activeConnectors}</p>
          </div>

        </div>
      )}

      {/* Connectors Registry Table & Resilience Toggle */}
      <div className="bg-white border border-[#E6ECF4] rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6ECF4] pb-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#0B2A5B]" />
            <h2 className="text-xl font-bold text-[#0F1F3D]">Registered Connector Gateways</h2>
          </div>
          <span className="text-xs text-slate-500">Toggle "Simulate Failure" to test FAILED_SYNC fallback</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E6ECF4] text-xs font-bold text-slate-400 uppercase">
                <th className="py-3 px-4">Service Connector</th>
                <th className="py-3 px-4">Protocol</th>
                <th className="py-3 px-4">Health Status</th>
                <th className="py-3 px-4">Failure Simulation Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-[#0F1F3D]">
              {apis.map((apiItem) => {
                const isSimulating = apiItem.simulate_failure;
                return (
                  <tr key={apiItem.api_registry_id} className="hover:bg-slate-50/60">
                    <td className="py-4 px-4">
                      <div className="font-bold text-sm text-[#0B2A5B]">{apiItem.service_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{apiItem.base_url}</div>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold">
                      <span className="bg-slate-100 px-2 py-1 rounded text-slate-700">{apiItem.protocol}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        apiItem.health === 'HEALTHY' && !isSimulating
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        <Activity className="w-3.5 h-3.5" />
                        <span>{isSimulating ? 'SIMULATING FAILURE' : apiItem.health}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleFailure(apiItem.api_registry_id, isSimulating)}
                        disabled={togglingId === apiItem.api_registry_id}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                          isSimulating
                            ? 'bg-rose-600 hover:bg-rose-700 text-white'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{isSimulating ? 'Failure Active (OFF)' : 'Simulate Timeout'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
