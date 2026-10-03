import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Calculator, ArrowRight, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSchemeCode?: string;
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({
  isOpen,
  onClose,
  defaultSchemeCode = 'SCH-POST-01'
}) => {
  const navigate = useNavigate();
  const [schemeCode, setSchemeCode] = useState<string>(defaultSchemeCode);
  
  // Scheme-specific form inputs
  const [category, setCategory] = useState<string>('BC');
  const [annualIncome, setAnnualIncome] = useState<string>('180000');
  const [attendance, setAttendance] = useState<string>('85');
  const [marks, setMarks] = useState<string>('82');
  const [landSize, setLandSize] = useState<string>('2.5');
  const [isTaxpayer, setIsTaxpayer] = useState<string>('No');
  const [rationType, setRationType] = useState<string>('BPL / Priority');
  const [age, setAge] = useState<string>('20');
  const [fitnessPassed, setFitnessPassed] = useState<string>('Yes');
  const [ownsHouse, setOwnsHouse] = useState<string>('No');

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const payloadFields: any = {
        category,
        annual_income: Number(annualIncome),
        college_attendance: Number(attendance),
        marks_percentage: Number(marks),
        land_size: Number(landSize),
        is_taxpayer: isTaxpayer,
        ration_card_type: rationType,
        age: Number(age),
        fitness_passed: fitnessPassed,
        owns_house: ownsHouse
      };

      const res = await api.post('/eligibility/check', {
        scheme_code: schemeCode,
        fields: payloadFields
      });
      setResult(res.data);
    } catch (err: any) {
      alert('Error verifying scheme eligibility');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="bg-white w-full max-w-[460px] rounded-2xl shadow-modal overflow-hidden animate-fadeIn border border-[#E2E8F0]">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#E2E8F0] bg-[#08234D] text-white">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Scheme Eligibility Calculator</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Scheme Selector */}
          <div>
            <label className="block text-[13px] font-bold text-[#0F172A] mb-1">
              Select Target Scheme <span className="text-rose-500">*</span>
            </label>
            <select
              value={schemeCode}
              onChange={(e) => {
                setSchemeCode(e.target.value);
                setResult(null);
              }}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#08234D] bg-slate-50 focus:ring-2 focus:ring-[#08234D]"
            >
              <option value="SCH-POST-01">🎓 Post-Matric Tuition Fee Reimbursement</option>
              <option value="SCH-MERIT-02">🏆 National Merit Scholarship Scheme</option>
              <option value="AGR-KSN-01">🌾 PM-KISAN Farmer Financial Assistance</option>
              <option value="HLT-CARD-01">🏥 Universal Health Insurance Card (PM-JAY)</option>
              <option value="INC-CERT-01">📄 e-District Income Certificate Fee Concession</option>
              <option value="RTO-LIC-01">🚗 Learner Driving License Permit (LLR)</option>
              <option value="HSG-APPL-01">🏠 Urban Affordable Housing Allotment (PMAY)</option>
            </select>
          </div>

          {/* DYNAMIC SCHEME INPUT FIELDS */}
          
          {/* Post-Matric Fee Reimbursement */}
          {schemeCode === 'SCH-POST-01' && (
            <div className="space-y-3 animate-fadeIn bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] bg-white font-medium"
                >
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="BC">BC (Backward Class)</option>
                  <option value="OBC">OBC (Other Backward Class)</option>
                  <option value="General/Others">General / Others</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Annual Family Income (Rs) *</label>
                <input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  placeholder="e.g. 180000"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] bg-white font-medium"
                />
              </div>
            </div>
          )}

          {/* National Merit Scholarship */}
          {schemeCode === 'SCH-MERIT-02' && (
            <div className="space-y-3 animate-fadeIn bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">10th / 12th Academic Score (%) *</label>
                <input
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="e.g. 85"
                  required
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Annual Family Income (Rs) *</label>
                <input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  placeholder="e.g. 150000"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] bg-white font-medium"
                />
              </div>
            </div>
          )}

          {/* PM-KISAN Farmer Support */}
          {schemeCode === 'AGR-KSN-01' && (
            <div className="space-y-3 animate-fadeIn bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Agricultural Landholding (Acres) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  placeholder="e.g. 2.5"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Are you an Income Taxpayer? *</label>
                <select
                  value={isTaxpayer}
                  onChange={(e) => setIsTaxpayer(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] bg-white font-medium"
                >
                  <option value="No">No (Ineligible if paying income tax)</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          )}

          {/* Universal Health Insurance */}
          {schemeCode === 'HLT-CARD-01' && (
            <div className="space-y-3 animate-fadeIn bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Ration Card Category *</label>
                <select
                  value={rationType}
                  onChange={(e) => setRationType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] bg-white font-medium"
                >
                  <option value="BPL / Priority">BPL (Below Poverty Line) / Priority Household</option>
                  <option value="AAY Antyodaya">AAY (Antyodaya Anna Yojana)</option>
                  <option value="General/None">General / Non-BPL</option>
                </select>
              </div>
            </div>
          )}

          {/* Income Certificate Concession */}
          {schemeCode === 'INC-CERT-01' && (
            <div className="space-y-3 animate-fadeIn bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Declared Annual Family Income (Rs) *</label>
                <input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  placeholder="e.g. 140000"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] bg-white font-medium"
                />
              </div>
            </div>
          )}

          {/* Learner License */}
          {schemeCode === 'RTO-LIC-01' && (
            <div className="space-y-3 animate-fadeIn bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Applicant Age (Years) *</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 20"
                  required
                  min="14"
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Vision & Physical Fitness Test Passed? *</label>
                <select
                  value={fitnessPassed}
                  onChange={(e) => setFitnessPassed(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] bg-white font-medium"
                >
                  <option value="Yes">Yes (Self-certified fit)</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          )}

          {/* Urban Housing Allotment */}
          {schemeCode === 'HSG-APPL-01' && (
            <div className="space-y-3 animate-fadeIn bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Annual Household Income (Rs) *</label>
                <input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  placeholder="e.g. 220000"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F1F3D] mb-1">Do you own a Pucca House anywhere in India? *</label>
                <select
                  value={ownsHouse}
                  onChange={(e) => setOwnsHouse(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] bg-white font-medium"
                >
                  <option value="No">No (Pucca house ownership disqualifies under PMAY)</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#08234D] hover:bg-[#0F346C] text-white font-bold py-3 rounded-xl text-sm shadow-sm transition-colors flex items-center justify-center gap-2 border border-amber-500/30"
          >
            {loading ? 'Verifying Criteria...' : 'Check Scheme Eligibility'}
          </button>
        </form>

        {/* Result Block */}
        {result && (
          <div className="px-6 pb-6 animate-fadeIn">
            {result.isEligible ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-950">
                <div className="flex items-center gap-2 font-extrabold text-emerald-900 text-sm mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Eligible for {result.schemeTitle}!</span>
                </div>
                <p className="text-xs font-semibold text-emerald-800 mb-2">🎁 {result.benefit}</p>
                <p className="text-xs text-emerald-700 mb-3">✓ All scheme-specific statutory criteria satisfied!</p>

                <button
                  onClick={() => { onClose(); navigate(`/apply/${schemeCode}`); }}
                  className="w-full bg-[#08234D] hover:bg-[#0F346C] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Proceed to Apply</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-orange-950">
                <div className="flex items-center gap-2 font-extrabold text-orange-900 text-sm mb-1">
                  <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />
                  <span>Criteria Not Satisfied for {result.schemeTitle}</span>
                </div>
                <ul className="text-xs text-orange-800 space-y-1 list-disc pl-4 mt-2 font-medium">
                  {result.reasons?.map((reason: string, idx: number) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
