import React from 'react';
import { HelpCircle, ShieldCheck, ChevronDown } from 'lucide-react';

export const HelpFaqs: React.FC = () => {
  const faqs = [
    {
      q: 'What is SETU?',
      a: 'SETU ("bridge" in Hindi/Sanskrit) is an academic prototype of a consent-based interoperability gateway for unified government service discovery and application tracking in India.'
    },
    {
      q: 'Why does service fragmentation exist?',
      a: 'India\'s federal structure splits government services across ministries, states, districts, and local vendors. Systems have separate databases, authentication flows, document requirements, and status formats. Citizens face duplicate data entry and scattered tracking. SETU demonstrates a common interoperability layer to bridge these silos.'
    },
    {
      q: 'Do I need to enter real Aadhaar, OTPs or document files?',
      a: 'NO. This is an academic prototype. Do NOT enter real Aadhaar numbers, OTPs, real passwords, or real personal bank details. All credentials and documents are fictional.'
    },
    {
      q: 'How does consent management work in SETU?',
      a: 'Before any data is transmitted to a recipient department service, you are shown an explicit consent screen detailing the exact fields, purpose, and expiry. You can inspect or revoke consent anytime via your Consent Dashboard.'
    },
    {
      q: 'What do the Connector Labels (MOCK_SIMULATION, PUBLIC_OPEN_DATA) mean?',
      a: 'Every service clearly displays its integration type: MOCK_SIMULATION (synthetic backend sandbox), PUBLIC_OPEN_DATA (data.gov.in public catalog), OFFICIAL_SANDBOX, PARTNER_ONLY, or REDIRECT_ONLY.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#0B2A5B] tracking-tight">Citizen Guidelines & FAQs</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Frequently asked questions about SETU consent gateway architecture and citizen interoperability.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white border border-[#E6ECF4] rounded-2xl p-6 shadow-soft space-y-2">
            <h3 className="font-bold text-[#0F1F3D] text-base flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#0B2A5B] shrink-0" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed pl-7">{faq.a}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
