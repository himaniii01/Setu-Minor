import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Departments: React.FC = () => {
  const depts = [
    { name: 'e-District Revenue Department', servicesCount: 4, type: 'State Revenue & Civic' },
    { name: 'Department of Higher Education', servicesCount: 2, type: 'Education & Welfare' },
    { name: 'Municipal Health & Vital Statistics', servicesCount: 2, type: 'Urban Local Body' },
    { name: 'Ministry of Agriculture & Farmers Welfare', servicesCount: 1, type: 'Central Ministry' },
    { name: 'Regional Transport Office (RTO)', servicesCount: 1, type: 'Transport & Safety' },
    { name: 'Housing Development Board', servicesCount: 1, type: 'Housing & Urban Dev' },
    { name: 'Survey and Land Records Dept', servicesCount: 1, type: 'Revenue & Cadastral' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0B2A5B] tracking-tight">Departments Directory</h1>
        <p className="text-slate-500 text-sm mt-1">Participating government ministries, state departments, and local bodies</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {depts.map((d, idx) => (
          <div key={idx} className="bg-white border border-[#E6ECF4] rounded-3xl p-6 shadow-soft flex flex-col justify-between space-y-4 card-hover">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0B2A5B] flex items-center justify-center font-bold mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#0F1F3D] text-lg mb-1">{d.name}</h3>
              <p className="text-xs text-slate-400 font-semibold">{d.type}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md">
                {d.servicesCount} Gateway Services
              </span>
              <Link to="/services" className="font-bold text-[#0B2A5B] flex items-center gap-1 hover:underline">
                <span>View Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
