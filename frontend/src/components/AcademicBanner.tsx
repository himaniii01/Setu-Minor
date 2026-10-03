import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const AcademicBanner: React.FC = () => {
  return (
    <div className="bg-[#0B2A5B] border-b border-slate-700 text-slate-200 px-4 py-1.5 text-xs font-medium text-center flex flex-wrap items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span className="font-semibold">Official Gateway for Digital India Government Services & Unified Citizen Access</span>
      </div>
      <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-300">
        <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
          india.gov.in <ExternalLink className="w-3 h-3" />
        </a>
        <span>|</span>
        <a href="https://digilocker.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
          DigiLocker <ExternalLink className="w-3 h-3" />
        </a>
        <span>|</span>
        <a href="https://web.umang.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
          UMANG <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
