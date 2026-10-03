import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileCheck, GraduationCap, HeartPulse, Tractor, Building, Car, Home,
  FileText, Search, ChevronRight, ArrowRight, Filter, AlertCircle, ExternalLink, Globe, ShieldCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { GovernmentService } from '../types';
import { ConnectorChip } from '../components/ConnectorChip';

export const ServicesDirectory: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryParam = searchParams.get('category') || 'ALL';
  const searchParam = searchParams.get('search') || '';

  const [services, setServices] = useState<GovernmentService[]>([]);
  const [allServicesCount, setAllServicesCount] = useState<number>(14);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategoryParam);
  const [query, setQuery] = useState<string>(searchParam);

  const isHindi = i18n.language === 'hi';

  const categories = [
    {
      title: isHindi ? 'नागरिक प्रमाणपत्र' : 'Citizen Certificates',
      rawTitle: 'Citizen Certificates',
      desc: isHindi ? 'आय, निवास, जाति और मूल निवासी प्रमाणपत्र' : 'Income, Residence, Caste and Domicile statutory certificate issuance',
      icon: FileCheck,
      bg: 'bg-[#EFF6FF]',
      border: 'border-blue-200',
      iconColor: 'text-[#08234D]'
    },
    {
      title: isHindi ? 'शिक्षा और छात्रवृत्ति' : 'Education & Scholarships',
      rawTitle: 'Education & Scholarships',
      desc: isHindi ? 'फीस प्रतिपूर्ति, पीएम सूर्य घर, लखपति दीदी और युवा इंटर्नशिप' : 'Post-Matric tuition fee reimbursement, merit stipends and student aid',
      icon: GraduationCap,
      bg: 'bg-[#FEF3C7]',
      border: 'border-amber-200',
      iconColor: 'text-amber-700'
    },
    {
      title: isHindi ? 'स्वास्थ्य एवं चिकित्सा' : 'Health & Medical Welfare',
      rawTitle: 'Health & Medical Welfare',
      desc: isHindi ? 'आयुष्मान वय वंदना 70+ कार्ड और सार्वभौमिक स्वास्थ्य कार्ड' : 'Ayushman Vaya Vandana 70+ card and universal health insurance coverage',
      icon: HeartPulse,
      bg: 'bg-[#F0FDF4]',
      border: 'border-emerald-200',
      iconColor: 'text-emerald-700'
    },
    {
      title: isHindi ? 'कृषि और किसान कल्याण' : 'Agriculture & Farmers Welfare',
      rawTitle: 'Agriculture & Farmers Welfare',
      desc: isHindi ? 'डिजिटल कृषि मिशन, एग्रीस्टैक किसान आईडी और पीएम विश्वकर्मा' : 'Digital Agriculture Mission, Agristack farmer ID & PM Vishwakarma',
      icon: Tractor,
      bg: 'bg-[#FAF5FF]',
      border: 'border-purple-200',
      iconColor: 'text-purple-700'
    },
    {
      title: isHindi ? 'नगर पालिका सेवाएं' : 'Municipal & Civic Amenities',
      rawTitle: 'Municipal & Civic Amenities',
      desc: isHindi ? 'पीएम सूर्य घर मुफ्त बिजली योजना, जन्म प्रमाणपत्र और नागरिक सेवाएं' : 'PM Surya Ghar rooftop solar subsidy, birth extracts and civic permits',
      icon: Building,
      bg: 'bg-[#FFF7ED]',
      border: 'border-orange-200',
      iconColor: 'text-orange-700'
    },
    {
      title: isHindi ? 'परिवहन और आरटीओ' : 'Transport & RTO Services',
      rawTitle: 'Transport & RTO Services',
      desc: isHindi ? 'परिवहन सेवा, ड्राइविंग लाइसेंस (LLR) और वाहन पंजीकरण' : 'Parivahan Sewa driving license (LLR), vehicle registration & RC',
      icon: Car,
      bg: 'bg-[#FDF2F8]',
      border: 'border-pink-200',
      iconColor: 'text-pink-700'
    },
    {
      title: isHindi ? 'आवास योजनाएं' : 'Housing & Site Allotment',
      rawTitle: 'Housing & Site Allotment',
      desc: isHindi ? 'पीएम आवास योजना 2.0 (शहरी एवं ग्रामीण आवास सब्सिडी)' : 'PM Awas Yojana 2.0 urban and rural housing interest subsidy',
      icon: Home,
      bg: 'bg-[#F0FDFA]',
      border: 'border-teal-200',
      iconColor: 'text-teal-700'
    },
    {
      title: isHindi ? 'राजस्व और भू-अभिलेख' : 'Revenue & Land Records',
      rawTitle: 'Revenue & Land Records',
      desc: isHindi ? 'डिजिटल भूमि रिकॉर्ड (अडंगल/पहानी) और सर्वेक्षण रिकॉर्ड' : 'Digital land title extracts (Adangal/Pahani) and survey extracts',
      icon: FileText,
      bg: 'bg-slate-100',
      border: 'border-slate-200',
      iconColor: 'text-slate-700'
    },
  ];

  // Direct Government External URLs
  const getDirectPortalUrl = (code: string) => {
    if (code.startsWith('PM-SOLAR')) return 'https://pmsuryaghar.gov.in';
    if (code.startsWith('LAKHPATI')) return 'https://lakhpatididi.gov.in';
    if (code.startsWith('AYUSH')) return 'https://dashboard.pmjay.gov.in';
    if (code.startsWith('VIKSIT')) return 'https://internship.mca.gov.in';
    if (code.startsWith('APAAR')) return 'https://apaar.education.gov.in';
    if (code.startsWith('AGR-AGRI')) return 'https://agristack.gov.in';
    if (code.startsWith('VISHWA')) return 'https://pmvishwakarma.gov.in';
    if (code.startsWith('HSG-PMAY')) return 'https://pmaymis.gov.in';
    if (code.startsWith('INC-CERT') || code.startsWith('RES-CERT') || code.startsWith('CST-CERT')) return 'https://edistrict.gov.in';
    if (code.startsWith('SCH-')) return 'https://scholarships.gov.in';
    if (code.startsWith('MNC-')) return 'https://india.gov.in';
    if (code.startsWith('RTO-')) return 'https://parivahan.gov.in';
    if (code.startsWith('REV-')) return 'https://landrecords.gov.in';
    return 'https://india.gov.in';
  };

  useEffect(() => {
    fetchServices();
  }, [activeCategory, query]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (activeCategory && activeCategory !== 'ALL') params.category = activeCategory;
      if (query) params.search = query;
      const res = await api.get('/services', { params });
      setServices(res.data.services);
      if (!activeCategory || activeCategory === 'ALL') {
        setAllServicesCount(res.data.services.length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (rawTitle: string) => {
    setActiveCategory(rawTitle);
    if (rawTitle === 'ALL') {
      setSearchParams({});
    } else {
      setSearchParams({ category: rawTitle });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Top Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#08234D] tracking-tight">
            {isHindi ? 'सरकारी सेवाएं निर्देशिका 2026' : 'Government Services Directory 2026'}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            {isHindi ? 'नागरिक श्रेणी द्वारा आयोजित भारत सरकार की राष्ट्रीय सेवाएं एवं पोर्टल' : 'National government portals and citizen services organized by category'}
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isHindi ? 'सेवाएं, कोड या विभाग खोजें...' : 'Search services, codes or departments...'}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#08234D] bg-white font-medium"
            />
          </div>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl hover:bg-rose-100 transition-colors shrink-0"
            >
              {isHindi ? 'साफ़ करें' : 'Clear Search'}
            </button>
          )}
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: LEFT SIDEBAR CATEGORIES + RIGHT SERVICES PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SIDEBAR: CATEGORIES SELECTOR */}
        <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-soft space-y-3 sticky top-24">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 px-1">
            <h3 className="font-extrabold text-[#08234D] text-base uppercase tracking-wider">
              {isHindi ? 'सेवा श्रेणियां' : 'Service Categories'}
            </h3>
            <span className="text-xs font-bold text-slate-500">8 {isHindi ? 'श्रेणियां' : 'Categories'}</span>
          </div>

          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            
            {/* All Services Option */}
            <button
              onClick={() => handleCategorySelect('ALL')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all text-left ${
                activeCategory === 'ALL' || !activeCategory
                  ? 'bg-[#08234D] text-white shadow-sm ring-2 ring-[#08234D]/20'
                  : 'bg-slate-50 text-slate-[#0F172A] hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Filter className={`w-4 h-4 ${activeCategory === 'ALL' ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{isHindi ? 'सभी सरकारी सेवाएं' : 'All Government Services'}</span>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 ${activeCategory === 'ALL' ? 'text-amber-400' : 'text-slate-300'}`} />
            </button>

            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.rawTitle;
              return (
                <button
                  key={cat.rawTitle}
                  onClick={() => handleCategorySelect(cat.rawTitle)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all text-left ${
                    isSelected
                      ? 'bg-[#08234D] text-white shadow-sm ring-2 ring-[#08234D]/20'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : cat.iconColor}`} />
                    <span className="truncate">{cat.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-300'}`} />
                </button>
              );
            })}

          </div>
        </div>

        {/* RIGHT MAIN PANEL: SERVICES LIST */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">
                {activeCategory && activeCategory !== 'ALL'
                  ? (categories.find(c => c.rawTitle === activeCategory)?.title || activeCategory)
                  : (isHindi ? 'सभी उपलब्ध सरकारी सेवाएं एवं योजनाएं 2026' : 'All National Government Services & Schemes 2026')}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {isHindi ? 'आधिकारिक पोर्टल लिंक एवं प्रत्यक्ष आवेदन सुविधा' : 'Official government portals & direct portal application link'}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 font-medium">
              {isHindi ? 'सरकारी सेवाएं सूची लोड हो रही है...' : 'Loading government services directory...'}
            </div>
          ) : services.length === 0 ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8 text-slate-300" />
              <p className="font-bold text-slate-700">{isHindi ? 'कोई सेवा नहीं मिली।' : 'No services matched your selection.'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((svc) => {
                const directUrl = getDirectPortalUrl(svc.code);
                return (
                  <div
                    key={svc.service_id}
                    className="border border-[#E2E8F0] hover:border-[#08234D] rounded-2xl p-5 hover:bg-slate-50/70 transition-all space-y-3 bg-white shadow-xs"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-slate-500">{svc.code}</span>
                          <span className="text-[11px] font-bold bg-blue-50 text-[#08234D] px-2 py-0.5 rounded">
                            {svc.category}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-[#0F172A] text-lg">{svc.name}</h3>
                        
                        {/* Benefit Details Description */}
                        <p className="text-xs text-[#334155] mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-medium">
                          💡 <strong>{isHindi ? 'मुख्य लाभ एवं विवरण:' : 'Benefits & Details:'}</strong> {svc.description}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <ConnectorChip type={svc.integration_type} />
                        <span className="text-[11px] font-semibold text-slate-400">{svc.state}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="text-slate-500 font-medium">
                        {isHindi ? 'मंत्रालय / विभाग:' : 'Ministry / Dept:'} <strong>{svc.provider}</strong>
                      </span>

                      <div className="flex items-center gap-3">
                        <a
                          href={directUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-xs transition-colors"
                        >
                          <span>{isHindi ? 'आधिकारिक पोर्टल खोलें' : 'Official Portal'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <Link
                          to={`/services/${svc.service_id}`}
                          className="font-bold bg-[#08234D] hover:bg-[#0F346C] text-white px-4 py-1.5 rounded-xl flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <span>{isHindi ? 'आवेदन करें >' : 'Apply >'}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
