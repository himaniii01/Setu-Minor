import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white border border-[#E6ECF4] rounded-3xl p-8 sm:p-12 shadow-soft space-y-6">
        <h1 className="text-3xl font-extrabold text-[#0B2A5B]">Academic Prototype Privacy Policy</h1>
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs">
          <strong>Mandatory Notice:</strong> SETU is an academic prototype system. No real citizen Aadhaar, real OTPs, real passwords, or financial banking details are collected or stored.
        </div>
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <h3 className="font-bold text-[#0F1F3D]">1. Purpose-Bound Data Transmission</h3>
          <p>Data stored in SETU prototype profiles is transmitted to mock service endpoints strictly upon citizen explicit consent.</p>
          <h3 className="font-bold text-[#0F1F3D]">2. Consent Revocation</h3>
          <p>Citizens maintain full authority to revoke granted consents via the Consent Dashboard at any time, instantly blocking future gateway routing.</p>
        </div>
      </div>
    </div>
  );
};
