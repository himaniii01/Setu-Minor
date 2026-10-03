import React from 'react';
import { Award, Calculator, ArrowRight, CheckCircle2, Heart, Sparkles, Sprout, Briefcase, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SchemesProps {
  onOpenEligibility: () => void;
}

export const Schemes: React.FC<SchemesProps> = ({ onOpenEligibility }) => {
  const schemesList = [
    {
      code: 'MP-SCH-001',
      title: 'Mukhyamantri Ladli Behna Yojana (Women Financial Aid)',
      dept: 'Department of Women & Child Development',
      benefit: 'Direct Monthly Financial Transfer of ₹1,250 to Women Bank Accounts',
      eligibility: 'Resident women aged 21-60 with annual family income <= ₹2,50,000',
      tag: 'Women Empowerment'
    },
    {
      code: 'MP-SCH-003',
      title: 'Mukhyamantri Seekho-Kamao Yojana (Skill & Stipend)',
      dept: 'Department of Technical Education & Skill Development',
      benefit: 'Hands-on Industry Training + Monthly Direct Stipend ₹8,000 to ₹10,000',
      eligibility: 'Youth aged 18-29 with 12th/ITI/Diploma/Graduation qualifications',
      tag: 'Youth & Employability'
    },
    {
      code: 'MP-SCH-007',
      title: 'Mukhyamantri Udyam Kranti Yojana (MSME Enterprise Loan)',
      dept: 'Department of Micro, Small & Medium Enterprises',
      benefit: 'Collateral-free loan up to ₹50 Lakh with 3% interest subsidy for 7 years',
      eligibility: 'Youth entrepreneurs (18-45 yrs) establishing new manufacturing/services unit',
      tag: 'MSME & Business'
    },
    {
      code: 'MP-SCH-021',
      title: 'Jal Jeevan Mission Household Tap Connection (FHTC)',
      dept: 'Public Health Engineering Department',
      benefit: 'Free functional tap water connection to every rural household',
      eligibility: 'All rural households without drinking water pipeline connections',
      tag: 'Civic Amenities'
    },
    {
      code: 'MP-SCH-024',
      title: 'Kisan Credit Card & Irrigation Equipment Subsidy',
      dept: 'Department of Agriculture & Farmers Welfare',
      benefit: 'Up to 50% subsidy on drip/sprinkler systems + low interest ₹3 Lakh KCC credit',
      eligibility: 'Small and marginal landholding farmer families with land records',
      tag: 'Agriculture'
    },
    {
      code: 'MP-SCH-052',
      title: 'Social Security Old Age, Widow & Disability Pension',
      dept: 'Department of Social Justice & Disabled Welfare',
      benefit: 'Monthly direct pension payout of ₹600 to ₹1,000 to beneficiary account',
      eligibility: 'Senior citizens (60+), destitute widows, or persons with 40%+ disability',
      tag: 'Social Security'
    },
    {
      code: 'MP-SCH-008',
      title: 'Mukhyamantri Kanya Vivah & Nikah Yojana',
      dept: 'Department of Social Justice',
      benefit: 'Financial support of ₹51,000 per eligible bride for marriage arrangements',
      eligibility: 'Needy families, widows, and divorcee women registered under scheme criteria',
      tag: 'Social Support'
    },
    {
      code: 'PM-SOLAR-2026',
      title: 'PM Surya Ghar: Muft Bijli Yojana (Rooftop Solar)',
      dept: 'Ministry of New and Renewable Energy',
      benefit: 'Free electricity up to 300 units/mo + ₹78,000 central capital subsidy',
      eligibility: 'All residential households with suitable rooftop space and DISCOM ID',
      tag: 'Clean Energy'
    },
    {
      code: 'SCH-POST-01',
      title: 'Post-Matric Tuition Fee Waiver & Allowance',
      dept: 'Department of Higher Education',
      benefit: '100% Tuition Fee Waiver + Annual Student Maintenance Allowance',
      eligibility: 'SC, ST, BC, EWS college students with annual family income <= ₹2.5 Lakh',
      tag: 'Education'
    },
    {
      code: 'AYUSH-SENIOR-70',
      title: 'Ayushman Vaya Vandana Card (Senior Citizen 70+)',
      dept: 'National Health Authority',
      benefit: 'Cashless hospital coverage up to ₹5 Lakh/year regardless of family income',
      eligibility: 'All senior citizens aged 70 and above across India',
      tag: 'Healthcare'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0B2A5B] via-[#0F346C] to-[#12397A] rounded-3xl p-8 text-white shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-amber-400/30">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3.5 py-1 rounded-full text-xs font-extrabold border border-amber-400/30 uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-400" />
            <span>2026 Official Welfare Schemes Catalog</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Government Welfare & Social Benefit Schemes</h1>
          <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
            Direct online application portal for women empowerment, youth skill stipends, farmer assistance, MSME loans, pensions, and tuition fee waivers.
          </p>
        </div>

        <button
          onClick={onOpenEligibility}
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl text-xs shadow-gold transition-all flex items-center gap-2 shrink-0"
        >
          <Calculator className="w-4 h-4" />
          <span>Launch Eligibility Calculator</span>
        </button>
      </div>

      {/* Schemes Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemesList.map((sch) => (
          <div key={sch.code} className="bg-white border border-[#E6ECF4] rounded-3xl p-6 shadow-soft space-y-4 flex flex-col justify-between card-hover hover:border-[#0B2A5B]/30 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-black bg-blue-50 text-[#0B2A5B] border border-blue-100 px-3 py-1 rounded-lg">
                  {sch.code}
                </span>
                <span className="text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  {sch.tag}
                </span>
              </div>
              
              <h3 className="text-lg font-black text-[#0F1F3D] mb-1 leading-snug">{sch.title}</h3>
              <p className="text-xs text-slate-400 font-semibold mb-3">{sch.dept}</p>
              
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 font-medium text-emerald-950 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-900 font-extrabold">Benefit: </strong>
                    <span>{sch.benefit}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-slate-600 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 font-bold">Eligibility Criteria: </strong>
                    <span>{sch.eligibility}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={onOpenEligibility}
                className="text-xs font-bold text-[#0B2A5B] hover:underline"
              >
                Check Criteria
              </button>
              <Link
                to={`/apply/${sch.code}`}
                className="bg-[#0B2A5B] hover:bg-[#12397A] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Apply for Scheme</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

