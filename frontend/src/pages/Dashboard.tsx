import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Shield, UserCheck, Clock, RefreshCw, Bell, ArrowRight, ExternalLink, Globe, Smartphone, Landmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ServiceApplication } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ConnectorChip } from '../components/ConnectorChip';
import { GovernmentBuildingCarousel } from '../components/GovernmentBuildingCarousel';

export const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  const isHindi = i18n.language === 'hi';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const resApp = await api.get('/applications');
      setApplications(resApp.data.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStatus = async (appId: string) => {
    setRefreshingId(appId);
    try {
      await api.post(`/applications/${appId}/refresh-status`);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to refresh status');
    } finally {
      setRefreshingId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Profile Summary */}
      <div className="bg-gradient-to-r from-[#08234D] via-[#0F346C] to-[#12397A] rounded-3xl p-6 sm:p-8 text-white shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden border border-amber-500/30">
        
        {/* Background ambient glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl border-2 border-amber-400 bg-[#08234D] text-amber-400 flex items-center justify-center font-black text-2xl shadow-gold shrink-0 uppercase">
              {(user?.profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] ring-2 ring-slate-900 font-bold" title="Verified Account">
              ✓
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{user.profile?.full_name}</h1>
              <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {isHindi ? 'आधार सत्यापित' : 'Aadhaar Verified'}
              </span>
            </div>

            <p className="text-xs text-slate-200 font-mono flex items-center gap-2">
              <span>{isHindi ? 'नागरिक आईडी:' : 'Citizen ID:'} <strong className="text-amber-300">{user.profile?.prototype_cit_id}</strong></span>
              <span>•</span>
              <span className="text-slate-300">{user.profile?.district}, {user.profile?.state}</span>
            </p>
          </div>
        </div>

        {/* Quick Action Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <Link
            to="/profile"
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition-colors flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>{isHindi ? 'मेरी प्रोफ़ाइल' : 'My Profile'}</span>
          </Link>

          <Link
            to="/vault"
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>{isHindi ? 'दस्तावेज़ लॉकर' : 'Document Vault'}</span>
          </Link>

          <Link
            to="/consents"
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-gold flex items-center gap-1.5"
          >
            <Shield className="w-4 h-4" />
            <span>{isHindi ? 'सहमति डैशबोर्ड' : 'Consent Dashboard'}</span>
          </Link>
        </div>
      </div>

      {/* NATIONAL DIGITAL PORTAL LAUNCHERS STRIP */}
      <div className="p-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#08234D]" />
            <span>{isHindi ? 'राष्ट्रीय डिजिटल पोर्टल डायरेक्ट लॉन्चर्स' : 'National Digital Portal Direct Launchers'}</span>
          </h3>
          <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full uppercase">
            Official Portals
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="https://digilocker.gov.in"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/50 hover:bg-blue-100/60 border border-blue-200 text-xs font-bold text-[#08234D] transition-all shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-700 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-extrabold text-sm">DigiLocker Portal</p>
                <p className="text-[10px] text-slate-500 font-normal">Digital Documents Vault</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
          </a>

          <a
            href="https://web.umang.gov.in"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200 text-xs font-bold text-slate-900 transition-all shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-extrabold text-sm">UMANG App Gateway</p>
                <p className="text-[10px] text-slate-500 font-normal">1200+ Central/State Services</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-amber-600 shrink-0" />
          </a>

          <a
            href="https://pmsuryaghar.gov.in"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-200 text-xs font-bold text-slate-900 transition-all shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-extrabold text-sm">PM Surya Ghar Portal</p>
                <p className="text-[10px] text-slate-500 font-normal">300 Units Free Electricity</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-emerald-600 shrink-0" />
          </a>

          <a
            href="https://passportindia.gov.in"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-4 rounded-2xl bg-purple-50/50 hover:bg-purple-100/60 border border-purple-200 text-xs font-bold text-slate-900 transition-all shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-purple-700 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-extrabold text-sm">Passport Seva</p>
                <p className="text-[10px] text-slate-500 font-normal">External Affairs Portal</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-purple-600 shrink-0" />
          </a>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Applications Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-[#08234D]" />
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {isHindi ? 'मेरे आवेदन और स्थिति' : 'My Applications Timeline'}
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {applications.length} {isHindi ? 'आवेदन' : 'Applications'}
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <p>{isHindi ? 'अभी कोई आवेदन नहीं किया गया है।' : 'No applications logged yet.'}</p>
                <Link to="/services" className="text-xs font-bold text-[#08234D] underline">
                  {isHindi ? 'सेवा निर्देशिका देखें' : 'Explore Services Directory'}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.application_id}
                    className="border border-[#E2E8F0] rounded-2xl p-5 hover:bg-slate-50/50 transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-slate-500">{app.external_ref}</span>
                        <h3 className="font-bold text-[#0F172A] text-base">{app.service?.name}</h3>
                        <p className="text-xs text-slate-500">
                          {isHindi ? 'विभाग:' : 'Provider:'} <strong>{app.service?.provider}</strong>
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1.5">
                        <StatusBadge status={app.canonical_status} />
                        {app.service?.integration_type && (
                          <ConnectorChip type={app.service.integration_type} />
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-slate-400">
                        {isHindi ? 'आवेदन तिथि:' : 'Submitted on:'} {new Date(app.created_at).toLocaleDateString('en-IN')}
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleRefreshStatus(app.application_id)}
                          disabled={refreshingId === app.application_id}
                          className="text-[#08234D] font-semibold hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${refreshingId === app.application_id ? 'animate-spin' : ''}`} />
                          <span>{isHindi ? 'लाइव अपडेट जांचें' : 'Poll Live Update'}</span>
                        </button>

                        <Link
                          to={`/track?ref=${app.external_ref}`}
                          className="font-bold text-[#08234D] hover:underline flex items-center gap-1"
                        >
                          <span>{isHindi ? 'पूरा विवरण >' : 'Full Timeline >'}</span>
                        </Link>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Right 1 Col: Quick Links */}
        <div className="space-y-6">
          
          {/* Document Vault Summary */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <FileText className="w-5 h-5 text-[#08234D]" />
              <h3 className="font-bold text-[#0F172A] text-base">
                {isHindi ? 'दस्तावेज़ तिजोरी' : 'Private Document Vault'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isHindi ? 'अपने सत्यापित दस्तावेज़ और डिजिलॉकर फ़ाइलें देखें।' : 'Access your verified documents and DigiLocker references.'}
            </p>
            <Link
              to="/vault"
              className="w-full bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold py-2.5 rounded-xl block text-center transition-colors"
            >
              {isHindi ? 'दस्तावेज़ तिजोरी खोलें >' : 'Open Document Vault & DigiLocker >'}
            </Link>
          </div>

          {/* Consent Dashboard Summary */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-[#0F172A] text-base">
                {isHindi ? 'सक्रिय सहमतियां' : 'Active Consents'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isHindi ? 'सरकारी सेवाओं को दी गई अनुमतियां प्रबंधित करें।' : 'Manage permissions granted to government services. Revoke anytime.'}
            </p>
            <Link
              to="/consents"
              className="w-full bg-[#08234D] hover:bg-[#0F346C] text-white text-xs font-bold py-2.5 rounded-xl block text-center transition-colors shadow-sm border border-amber-500/30"
            >
              {isHindi ? 'सहमति प्रबंधित करें >' : 'Manage Consent Grants >'}
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};
