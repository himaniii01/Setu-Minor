import React from 'react';
import { ShieldCheck, Cpu, Database, Activity, Globe, ExternalLink } from 'lucide-react';

export const AboutSetu: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="bg-white border border-[#E6ECF4] rounded-3xl p-8 sm:p-12 shadow-soft space-y-6">
        <div className="border-b border-[#E6ECF4] pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Digital India Gateway</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2A5B] mt-1">About SETU Unified Services Gateway</h1>
          <p className="text-sm text-slate-500 mt-2">
            Connecting citizens to government services, DigiLocker digital documents, UMANG mobile services, and multi-department tracking.
          </p>
        </div>

        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <h3 className="font-bold text-[#0F1F3D] text-lg">Direct Access to National Government Portals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <a href="https://digilocker.gov.in" target="_blank" rel="noreferrer" className="p-4 bg-blue-50/50 border border-blue-200 rounded-2xl hover:border-blue-500 transition-colors block">
              <div className="flex items-center justify-between font-bold text-[#0B2A5B]">
                <span>DigiLocker Portal</span>
                <ExternalLink className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-500 mt-1">Authentic digital document wallet for driving license, certificates, and academic marks memos.</p>
            </a>

            <a href="https://web.umang.gov.in" target="_blank" rel="noreferrer" className="p-4 bg-orange-50/50 border border-orange-200 rounded-2xl hover:border-orange-500 transition-colors block">
              <div className="flex items-center justify-between font-bold text-orange-900">
                <span>UMANG Mobile Gateway</span>
                <ExternalLink className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-500 mt-1">Unified Mobile Application for New-age Governance connecting 1200+ state & central services.</p>
            </a>

            <a href="https://passportindia.gov.in" target="_blank" rel="noreferrer" className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-[#0B2A5B] transition-colors block">
              <div className="flex items-center justify-between font-bold text-[#0F1F3D]">
                <span>Passport Seva</span>
                <ExternalLink className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-500 mt-1">Ministry of External Affairs official passport application and tracking portal.</p>
            </a>

            <a href="https://parivahan.gov.in" target="_blank" rel="noreferrer" className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl hover:border-emerald-500 transition-colors block">
              <div className="flex items-center justify-between font-bold text-emerald-900">
                <span>Parivahan Sewa (RTO)</span>
                <ExternalLink className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-500 mt-1">Road Transport & Highways portal for driving licenses, RC verification, and vehicle tax.</p>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};
