import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, CheckCircle2, Lock, XCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { ConsentRecord } from '../types';
import { useToast } from '../context/ToastContext';

export const ConsentDashboard: React.FC = () => {
  const { showToast } = useToast();
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    fetchConsents();
  }, []);

  const fetchConsents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/consents');
      setConsents(res.data.consents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (consentId: string, recipientName?: string) => {
    if (!window.confirm(`Are you sure you want to revoke consent for ${recipientName || 'this service'}? Future gateway calls for this service will be blocked.`)) {
      return;
    }

    setRevokingId(consentId);
    try {
      await api.post(`/consents/${consentId}/revoke`);
      showToast('Consent Revoked', 'Future gateway calls for this recipient are now blocked.', 'warning');
      fetchConsents();
    } catch (err: any) {
      showToast('Error', err.response?.data?.error?.message || 'Failed to revoke consent', 'error');
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6ECF4] pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0B2A5B] tracking-tight">Consent Management Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            View, inspect, and revoke data sharing permissions granted to government services via SETU Gateway.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 shrink-0">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Consent-Driven Privacy Policy Active</span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading active citizen consents...</div>
      ) : consents.length === 0 ? (
        <div className="bg-white border border-[#E6ECF4] rounded-3xl p-12 text-center text-slate-400 space-y-2 shadow-soft">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">No active consent records found.</p>
          <p className="text-xs">Consents are created explicitly during service application flows.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {consents.map((c) => {
            const isGranted = c.status === 'GRANTED';
            const fields: string[] = typeof c.requested_fields === 'string'
              ? JSON.parse(c.requested_fields)
              : c.requested_fields;

            return (
              <div
                key={c.consent_id}
                className={`bg-white border rounded-3xl p-6 sm:p-8 shadow-soft transition-all space-y-4 ${
                  isGranted ? 'border-[#E6ECF4]' : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono text-slate-400">Consent ID: {c.consent_id.slice(0, 12)}</span>
                    <h2 className="text-xl font-bold text-[#0F1F3D] mt-0.5">
                      {c.service?.name || 'Government Service Gateway'}
                    </h2>
                    <p className="text-xs text-slate-500">Recipient Provider: <strong>{c.service?.provider}</strong></p>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    isGranted
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {isGranted ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                    <span>{c.status}</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Authorized Data Fields</h4>
                  <div className="flex flex-wrap gap-2">
                    {fields.map((f) => (
                      <span key={f} className="bg-slate-100 text-[#0F1F3D] px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border border-slate-200">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
                  <strong>Stated Purpose:</strong> {c.purpose}
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400">
                    Granted on: {new Date(c.created_at).toLocaleDateString('en-IN')} • Expires: {new Date(c.expires_at).toLocaleDateString('en-IN')}
                  </span>

                  {isGranted && (
                    <button
                      onClick={() => handleRevoke(c.consent_id, c.service?.name)}
                      disabled={revokingId === c.consent_id}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      {revokingId === c.consent_id && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      <span>Revoke Consent</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
