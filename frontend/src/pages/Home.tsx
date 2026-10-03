import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, FileCheck, Award, Building2, Clock, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Bell, ExternalLink, Globe, Smartphone, CreditCard, Shield, Lock, FileText, Landmark
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ConnectorChip } from '../components/ConnectorChip';
import { GovernmentBuildingCarousel } from '../components/GovernmentBuildingCarousel';

interface HomeProps {
  onOpenEligibility: () => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenEligibility }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const isHindi = i18n.language === 'hi';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickTiles = [
    {
      title: t('quickTiles.certificates'),
      sub: t('quickTiles.certificatesSub'),
      icon: FileCheck,
      bgColor: 'bg-[#EFF6FF]',
      borderColor: 'border-blue-200',
      iconBg: 'bg-[#08234D]',
      path: '/services?category=Citizen%20Certificates'
    },
    {
      title: t('quickTiles.schemes'),
      sub: t('quickTiles.schemesSub'),
      icon: Award,
      bgColor: 'bg-[#FEF3C7]',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-600',
      path: '/schemes'
    },
    {
      title: t('quickTiles.departments'),
      sub: t('quickTiles.departmentsSub'),
      icon: Building2,
      bgColor: 'bg-[#F0FDF4]',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-600',
      path: '/departments'
    },
    {
      title: t('quickTiles.track'),
      sub: t('quickTiles.trackSub'),
      icon: Clock,
      bgColor: 'bg-[#FAF5FF]',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-600',
      path: '/track'
    },
  ];

  const govPortals = [
    {
      name: 'DigiLocker Portal',
      desc: isHindi ? 'ड्राइविंग लाइसेंस, अंकपत्र और डिजिटल प्रमाणपत्र प्राप्त करें' : 'Access authentic digital documents including Driving License, Marks Cards & Certificates',
      url: 'https://digilocker.gov.in',
      tag: isHindi ? 'डिजिटल दस्तावेज़ वॉलेट' : 'Digital Documents Vault',
      color: 'border-blue-200 hover:border-blue-600 bg-blue-50/40 text-blue-950',
      badgeBg: 'bg-[#08234D] text-white'
    },
    {
      name: 'UMANG Mobile App',
      desc: isHindi ? '1200+ केंद्र और राज्य सरकारी सेवाओं का एकीकृत मोबाइल ऐप' : 'Unified Mobile Application for New-age Governance with 1200+ Central/State services',
      url: 'https://web.umang.gov.in',
      tag: isHindi ? 'एकीकृत मोबाइल गेटवे' : 'Unified Mobile Gateway',
      color: 'border-amber-200 hover:border-amber-600 bg-amber-50/40 text-amber-950',
      badgeBg: 'bg-amber-600 text-white'
    },
    {
      name: 'Passport Seva',
      desc: isHindi ? 'ऑनलाइन पासपोर्ट आवेदन, अपॉइंटमेंट और स्थिति ट्रैकिंग पोर्टल' : 'Online Passport application, appointment scheduling, and live status tracking portal',
      url: 'https://passportindia.gov.in',
      tag: isHindi ? 'विदेश मंत्रालय' : 'Ministry of External Affairs',
      color: 'border-slate-200 hover:border-[#08234D] bg-slate-50 text-[#08234D]',
      badgeBg: 'bg-[#08234D] text-white'
    },
    {
      name: 'Parivahan Sewa (RTO)',
      desc: isHindi ? 'ड्राइविंग लाइसेंस (LLR/DL), आरसी सत्यापन और वाहन सेवाएं' : 'Driving License (LLR/DL), RC verification, vehicle tax and national RTO services',
      url: 'https://parivahan.gov.in',
      tag: isHindi ? 'सड़क परिवहन मंत्रालय' : 'Road Transport & Highways',
      color: 'border-emerald-200 hover:border-emerald-600 bg-emerald-50/40 text-emerald-950',
      badgeBg: 'bg-emerald-600 text-white'
    },
    {
      name: 'Income Tax e-Filing',
      desc: isHindi ? 'आयकर रिटर्न दाखिल करें, पैन-आधार लिंक और रिफंड स्थिति' : 'Direct IT Return filing, PAN linkage, Form 26AS, and tax refund status',
      url: 'https://eportal.incometax.gov.in',
      tag: isHindi ? 'आयकर गेटवे' : 'CBDT Income Tax Gateway',
      color: 'border-purple-200 hover:border-purple-600 bg-purple-50/40 text-purple-950',
      badgeBg: 'bg-purple-600 text-white'
    },
    {
      name: 'PM-KISAN Portal',
      desc: isHindi ? 'प्रत्यक्ष लाभ अंतरण (DBT) स्थिति, किसान पंजीकरण और किश्त विवरण' : 'Direct Benefit Transfer (DBT) status, farmer registration and installment tracking',
      url: 'https://pmkisan.gov.in',
      tag: isHindi ? 'कृषि कल्याण पोर्टल' : 'Agriculture Welfare Portal',
      color: 'border-teal-200 hover:border-teal-600 bg-teal-50/40 text-teal-950',
      badgeBg: 'bg-teal-600 text-white'
    },
  ];

  return (
    <div className="space-y-10 pb-12">

      {/* Live Updates Ticker */}
      <div className="bg-[#08234D] text-white px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center gap-3 overflow-hidden shadow-inner border-b border-amber-500/30">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded text-[11px] shrink-0 shadow-xs">
          <Bell className="w-3.5 h-3.5" />
          <span>{isHindi ? 'नवीनतम सूचनाएं' : 'Official Updates'}</span>
        </div>
        <div className="animate-marquee whitespace-nowrap overflow-x-auto text-slate-200 font-medium">
          {isHindi
            ? 'सेतु राष्ट्रीय गेटवे 2026 • पीएम सूर्य घर, लखपति दीदी, डिजिलॉकर और उमंग पोर्टल सीधे उपलब्ध • ऑनलाइन आवेदन स्थिति सक्रिय'
            : 'SETU National Gateway 2026 • Direct portal access to PM Surya Ghar, Lakhpati Didi, DigiLocker & UMANG Services • Real-time Application Tracking Active'}
        </div>
      </div>

      {/* HERO CARD WITH AUTO-ROTATING 4-BUILDING CAROUSEL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-soft overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">
          
          {/* Hero Left Content */}
          <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Landmark className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                  {isHindi ? 'डिजिटल इंडिया राष्ट्रीय पोर्टल' : 'Digital India National Portal'}
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                {t('hero.welcome')}
              </span>
              <h1 className="text-6xl sm:text-7xl font-extrabold text-[#08234D] tracking-tight mt-1 mb-3">
                SETU
              </h1>
              <p className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-lg font-medium">
                {t('hero.sub')}
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center bg-white border-2 border-[#E2E8F0] focus-within:border-[#08234D] rounded-2xl p-1.5 shadow-sm transition-all">
              <div className="pl-3.5 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full px-3 py-2 text-sm sm:text-base text-[#0F172A] bg-transparent focus:outline-none placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                className="bg-[#08234D] hover:bg-[#0F346C] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shrink-0 shadow-sm border border-amber-500/30"
              >
                {t('hero.searchBtn')}
              </button>
            </form>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4" /> {isHindi ? '100% सत्यापित नागरिक सेवाएं' : '100% Verified Citizen Services'}
              </span>
              <span>•</span>
              <span className="font-bold text-[#08234D]">{isHindi ? 'डिजिलॉकर एवं उमंग एकीकृत' : 'DigiLocker & UMANG Integrated'}</span>
            </div>
          </div>

          {/* Hero Right 4-Building Image Carousel */}
          <div className="w-full h-full min-h-[360px] overflow-hidden rounded-2xl sm:rounded-r-3xl">
            <GovernmentBuildingCarousel />
          </div>

        </div>
      </div>

      {/* QUICK-ACTION TILES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickTiles.map((tile, idx) => {
            const Icon = tile.icon;
            return (
              <Link
                key={idx}
                to={tile.path}
                className={`${tile.bgColor} border ${tile.borderColor} p-5 rounded-2xl flex items-center justify-between card-hover group shadow-sm`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`${tile.iconBg} text-white p-3 rounded-xl shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F172A] text-base group-hover:text-[#08234D] transition-colors">
                      {tile.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">{tile.sub}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* DIRECT ACCESS TO OFFICIAL GOVERNMENT PORTALS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-[#0F172A]">
                {isHindi ? 'आधिकारिक सरकारी पोर्टलों पर सीधा प्रवेश' : 'Direct Access to Official Government Portals'}
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              {isHindi ? 'राष्ट्रीय डिजिटल पोर्टलों पर एक-क्लिक प्रत्यक्ष पहुंच' : 'Single-click direct redirection to official national digital platforms'}
            </p>
          </div>
          <span className="text-xs font-extrabold bg-[#08234D] text-amber-300 px-3.5 py-1.5 rounded-full border border-amber-500/30 shadow-xs">
            6 {isHindi ? 'पोर्टल सक्रिय' : 'Official Portals Active'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {govPortals.map((portal) => (
            <a
              key={portal.name}
              href={portal.url}
              target="_blank"
              rel="noreferrer"
              className={`border ${portal.color} rounded-2xl p-6 shadow-soft transition-all duration-200 flex flex-col justify-between card-hover group bg-white`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${portal.badgeBg}`}>
                    {portal.tag}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0F172A] mb-1.5 group-hover:text-[#08234D] transition-colors">
                  {portal.name}
                </h3>
                <p className="text-xs leading-relaxed opacity-90">{portal.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-[#08234D]">
                <span>{isHindi ? 'पोर्टल खोलें >' : 'Access Portal >'}</span>
                <span className="font-mono text-[11px] text-slate-500">{portal.url.replace('https://', '')}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* POPULAR SERVICES GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">
              {isHindi ? 'लोकप्रिय नागरिक सेवाएं 2026' : 'Popular Citizen Services 2026'}
            </h2>
            <p className="text-sm text-slate-600">
              {isHindi ? 'राष्ट्रीय योजनाओं एवं सेवाओं का खोजें एवं सीधे आवेदन करें' : 'Discover and apply for key national welfare schemes and services'}
            </p>
          </div>
          <Link to="/services" className="text-sm font-bold text-[#08234D] hover:underline flex items-center gap-1">
            <span>{isHindi ? 'सभी सेवाएं देखें (14+)' : 'View All Directory (14+)'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-soft flex flex-col justify-between card-hover">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md">
                  {isHindi ? 'नगर पालिका सेवाएं' : 'Municipal & Civic'}
                </span>
                <ConnectorChip type="OFFICIAL_SANDBOX" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-1">PM Surya Ghar: Muft Bijli Yojana</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {isHindi ? '300 यूनिट तक मुफ्त बिजली एवं रु 78,000 तक की केंद्रीय सौर सब्सिडी।' : 'Provides free electricity up to 300 units/month plus central capital subsidy of up to Rs. 78,000 for rooftop solar.'}
              </p>
            </div>
            <Link
              to="/apply/PM-SOLAR-2026"
              className="w-full bg-[#08234D] hover:bg-[#0F346C] text-white text-xs font-bold py-2.5 rounded-xl text-center shadow-sm transition-colors block border border-amber-500/30"
            >
              {isHindi ? 'आवेदन करें >' : 'Apply via Gateway >'}
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-soft flex flex-col justify-between card-hover">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md">
                  {isHindi ? 'शिक्षा और छात्रवृत्ति' : 'Education & Welfare'}
                </span>
                <ConnectorChip type="OFFICIAL_SANDBOX" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-1">Post-Matric Fee Reimbursement</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {isHindi ? 'पात्र कॉलेज छात्रों के लिए 100% शिक्षण शुल्क छूट एवं वार्षिक रखरखाव भत्ता।' : 'Full tuition fee waiver & maintenance allowance for eligible SC/ST/BC/EWS college students.'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onOpenEligibility}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold py-2.5 rounded-xl transition-colors"
              >
                {isHindi ? 'पात्रता जांचें' : 'Check Eligibility'}
              </button>
              <Link
                to="/apply/SCH-POST-01"
                className="flex-1 bg-[#08234D] hover:bg-[#0F346C] text-white text-xs font-bold py-2.5 rounded-xl text-center transition-colors border border-amber-500/30"
              >
                {isHindi ? 'आवेदन करें' : 'Apply >'}
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-soft flex flex-col justify-between card-hover">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold bg-purple-100 text-purple-950 px-2.5 py-1 rounded-md">
                  {isHindi ? 'स्वास्थ्य कल्याण' : 'Health & Medical'}
                </span>
                <ConnectorChip type="OFFICIAL_SANDBOX" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-1">Ayushman Vaya Vandana Card</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {isHindi ? '70 वर्ष एवं अधिक आयु के सभी वरिष्ठ नागरिकों के लिए रु 5 लाख तक का कैशलेस इलाज।' : 'Free cashless healthcare coverage up to Rs. 5 Lakh per year for all senior citizens aged 70 and above.'}
              </p>
            </div>
            <Link
              to="/apply/AYUSH-SENIOR-70"
              className="w-full bg-[#08234D] hover:bg-[#0F346C] text-white text-xs font-bold py-2.5 rounded-xl text-center shadow-sm transition-colors block border border-amber-500/30"
            >
              {isHindi ? 'आवेदन करें >' : 'Apply via Gateway >'}
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
