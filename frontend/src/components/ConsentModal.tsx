import React from 'react';
import { ShieldCheck, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GovernmentService } from '../types';

interface ConsentModalProps {
  isOpen: boolean;
  service: GovernmentService;
  requestedFields: string[];
  purpose: string;
  onGrantConsent: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  service,
  requestedFields,
  purpose,
  onGrantConsent,
  onCancel,
  loading
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-modal overflow-hidden animate-fadeIn border border-[#E6ECF4]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B2A5B] text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-base">Explicit Citizen Data Consent</h3>
            <p className="text-xs text-slate-300">SETU Interoperability Gateway</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700">
            <p className="font-semibold text-[#0F1F3D] mb-1">Recipient Department / Service:</p>
            <p className="text-sm font-bold text-[#0B2A5B]">{service.name} ({service.provider})</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Purpose of Data Access
            </label>
            <p className="text-sm text-[#0F1F3D] bg-white border border-[#E6ECF4] p-3 rounded-lg font-medium">
              {purpose}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Specific Data Fields to be Shared
            </label>
            <div className="grid grid-cols-2 gap-2">
              {requestedFields.map((field) => (
                <div key={field} className="flex items-center gap-2 bg-emerald-50 text-emerald-900 px-3 py-2 rounded-lg text-xs font-semibold border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="capitalize">{field.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
            <Lock className="w-4 h-4 text-[#0B2A5B]" />
            <span>Consent Valid for: 180 Days (Can be revoked anytime in your Consent Dashboard)</span>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
            <span>By clicking 'Grant Consent & Submit', you authorize SETU to map and transmit only the checked profile fields to {service.provider}.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onGrantConsent}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#0B2A5B] hover:bg-[#12397A] text-white shadow-sm transition-colors flex items-center gap-2"
            >
              {loading ? 'Submitting Application...' : 'Grant Consent & Submit'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
