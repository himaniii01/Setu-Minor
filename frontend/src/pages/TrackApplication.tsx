import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Clock, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { ServiceApplication } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Timeline } from '../components/Timeline';
import { ConnectorChip } from '../components/ConnectorChip';

export const TrackApplication: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const refParam = searchParams.get('ref') || 'SETU-ED-2026-00045';

  const [ref, setRef] = useState<string>(refParam);
  const [loading, setLoading] = useState<boolean>(false);
  const [appData, setAppData] = useState<ServiceApplication | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (refParam) {
      handleTrack(refParam);
    }
  }, [refParam]);

  const handleTrack = async (searchRef: string) => {
    if (!searchRef.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setAppData(null);

    try {
      const res = await api.get(`/applications/track?ref=${encodeURIComponent(searchRef.trim())}`);
      setAppData(res.data.application);
      setSearchParams({ ref: searchRef.trim() });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || `No application found with reference "${searchRef}"`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(ref);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#0B2A5B] tracking-tight">Track Your Application</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Enter your application reference number to check live processing status across government providers.
        </p>
      </div>

      {/* Narrow White Card (~520px) */}
      <div className="max-w-[520px] mx-auto bg-white border border-[#E6ECF4] rounded-3xl p-6 sm:p-8 shadow-soft">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Application Reference Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                placeholder="Enter application number (e.g. SETU-ED-2026-00045)"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E6ECF4] text-sm font-mono font-semibold text-[#0F1F3D] focus:outline-none focus:ring-2 focus:ring-[#0B2A5B] bg-slate-50/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B2A5B] hover:bg-[#12397A] text-white font-bold py-3.5 rounded-xl text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{loading ? 'Fetching Provider Status...' : 'Track Application Status'}</span>
          </button>
        </form>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="max-w-[520px] mx-auto p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Result Card & Timeline */}
      {appData && (
        <div className="bg-white border border-[#E6ECF4] rounded-3xl p-6 sm:p-8 shadow-soft space-y-6 animate-fadeIn">
          
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E6ECF4] pb-6">
            <div>
              <span className="text-xs font-mono font-bold bg-blue-50 text-[#0B2A5B] px-2.5 py-1 rounded">
                {appData.external_ref}
              </span>
              <h2 className="text-xl font-extrabold text-[#0F1F3D] mt-2">{appData.service?.name}</h2>
              <p className="text-xs text-slate-500">Provider: <strong>{appData.service?.provider}</strong></p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={appData.canonical_status} />
              {appData.service?.integration_type && (
                <ConnectorChip type={appData.service.integration_type} />
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#0F1F3D] mb-2">Live Processing Timeline</h3>
            <Timeline
              statuses={appData.statuses || []}
              integrationType={appData.service?.integration_type}
            />
          </div>

        </div>
      )}

    </div>
  );
};
