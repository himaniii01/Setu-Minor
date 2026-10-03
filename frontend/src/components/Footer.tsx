import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Phone, ShieldCheck, Activity } from 'lucide-react';
import { AcademicBanner } from './AcademicBanner';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto">
      {/* Top Emerald Line (~3px) */}
      <div className="h-1 bg-[#16A34A] w-full" />

      {/* Main Solid Navy Footer */}
      <div className="bg-[#0B2A5B] text-slate-300 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: SETU Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400 bg-[#08234D] flex items-center justify-center shrink-0">
                <img src="/india_gov_emblem.jpg" alt="Government of India Emblem" className="w-full h-full object-cover scale-[1.35]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-white tracking-tight">SETU</span>
                  <span className="text-[9px] font-extrabold bg-amber-500 text-slate-950 px-2 py-0.5 rounded uppercase tracking-wider">
                    GOVT GATEWAY
                  </span>
                </div>
                <p className="text-[10px] text-amber-300 font-bold">सत्यमेव जयते • Government of India</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unified Digital India Gateway for citizen services, direct government portal access, and multi-department application tracking.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Digital India Unified Service Gateway</span>
            </div>
          </div>

          {/* Column 2: Quick Services */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-b border-slate-700/60 pb-2">Government Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/services" className="hover:text-white transition-colors">Income & Domicile Certificates</Link></li>
              <li><Link to="/schemes" className="hover:text-white transition-colors">Post-Matric Fee Reimbursement</Link></li>
              <li><Link to="/departments" className="hover:text-white transition-colors">Departments Directory</Link></li>
              <li><Link to="/track" className="hover:text-white transition-colors">Track Application Status</Link></li>
              <li><Link to="/grievances" className="hover:text-white transition-colors">CPGRAMS Citizen Grievances</Link></li>
            </ul>
          </div>

          {/* Column 3: Direct Portal Access */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-b border-slate-700/60 pb-2">Direct Government Portals</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="https://digilocker.gov.in" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-white font-semibold transition-colors">
                  DigiLocker Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a href="https://web.umang.gov.in" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-white font-semibold transition-colors">
                  UMANG Mobile Gateway <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a href="https://passportindia.gov.in" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  Passport Seva <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </li>
              <li>
                <a href="https://parivahan.gov.in" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  Parivahan Sewa (RTO) <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Reference Government Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-b border-slate-700/60 pb-2">National Gateways</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  National Portal of India <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </li>
              <li>
                <a href="https://apisetu.gov.in" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  API Setu Open Gateway <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </li>
              <li>
                <a href="https://data.gov.in" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  data.gov.in Open Data <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </li>
              <li>
                <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  PM-KISAN Portal <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="max-w-7xl mx-auto border-t border-slate-700/80 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400 shrink-0">
              <img src="/india_gov_emblem.jpg" alt="" className="w-full h-full object-cover scale-125" />
            </div>
            <p>© 2026 SETU - Interoperability Gateway • Government of India (सत्यमेव जयते)</p>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
