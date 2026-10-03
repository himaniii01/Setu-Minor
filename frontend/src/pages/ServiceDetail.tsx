import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, FileText, Server, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { GovernmentService } from '../types';
import { ConnectorChip } from '../components/ConnectorChip';

export const ServiceDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<GovernmentService | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isHindi = i18n.language === 'hi';

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/services/${id}`);
      setService(res.data.service);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading service details...</div>;
  if (!service) return <div className="py-20 text-center text-rose-500">Service not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <Link to="/services" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#08234D] hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>{isHindi ? 'सेवा निर्देशिका पर वापस जाएं' : 'Back to Services Directory'}</span>
      </Link>

      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-10 shadow-soft space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                {service.code}
              </span>
              <span className="text-xs font-bold bg-blue-50 text-[#08234D] px-2.5 py-1 rounded">
                {service.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">{service.name}</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {isHindi ? 'मंत्रालय / विभाग:' : 'Provider Department:'} <strong>{service.provider}</strong>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <ConnectorChip type={service.integration_type} />
            <span className="text-[11px] text-slate-400">{service.state}</span>
          </div>
        </div>

        {/* Description & Benefits */}
        <div>
          <h3 className="text-sm font-bold text-[#0F172A] mb-2 uppercase tracking-wider text-slate-500">
            {isHindi ? 'योजना के मुख्य लाभ एवं विवरण' : 'Scheme Benefits & Details'}
          </h3>
          <p className="text-sm text-[#334155] leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-medium">
            {service.description}
          </p>
        </div>

        {/* Technical Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-[#08234D] mb-1">
              <Server className="w-4 h-4 text-blue-600" />
              <span>{isHindi ? 'राष्ट्रीय गेटवे प्रोटोकॉल' : 'National Gateway Protocol'}</span>
            </div>
            <p className="text-slate-600">
              Protocol: {service.api_registry?.protocol || 'REST / JSON'} • Access Class: {service.api_registry?.access_class || 'RESTRICTED'}
            </p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'सहमति एवं डेटा सुरक्षा' : 'Data Permission & Consent'}</span>
            </div>
            <p className="text-emerald-800">
              {isHindi ? 'नागरिक द्वारा स्पष्ट सहमति दिए जाने के बाद ही आवेदन आगे बढ़ता है।' : 'Explicit citizen authorization required prior to submission.'}
            </p>
          </div>
        </div>

        {/* Required Documents */}
        <div>
          <h3 className="text-sm font-bold text-[#0F172A] mb-2 uppercase tracking-wider text-slate-500">
            {isHindi ? 'आवश्यक दस्तावेज' : 'Required Documents'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {service.required_documents.split(',').map((doc) => (
              <span key={doc} className="inline-flex items-center gap-1.5 bg-slate-100 text-[#0F172A] px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>{doc.trim()}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Apply Trigger */}
        <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href="https://india.gov.in"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1.5 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200"
          >
            <span>{isHindi ? 'आधिकारिक पोर्टल लिंक' : 'Official Portal Link'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => navigate(`/apply/${service.code}`)}
            className="w-full sm:w-auto bg-[#08234D] hover:bg-[#0F346C] text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-sm transition-colors flex items-center justify-center gap-2 border border-amber-500/30"
          >
            <span>{isHindi ? 'आवेदन प्रक्रिया शुरू करें' : 'Proceed to Application Form'}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </div>
  );
};
