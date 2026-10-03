import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const LodgeGrievance: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [department, setDepartment] = useState<string>('e-District Revenue Department');
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [districtArea, setDistrictArea] = useState<string>('Central District, Zone 4');
  const [urgency, setUrgency] = useState<string>('NORMAL');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to register a formal citizen grievance.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/grievances', {
        department,
        subject,
        description,
        district_area: districtArea,
        urgency
      });

      const refNo = res.data.reference_no;
      setSubmittedRef(refNo);
      showToast('Grievance Registered', `Grievance reference ${refNo} logged with department. SLA: 7 Days.`, 'success');
      setSubject('');
      setDescription('');
    } catch (err: any) {
      showToast('Error', err.response?.data?.error?.message || 'Failed to submit grievance', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#0B2A5B] tracking-tight">Lodge Citizen Grievance</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Register your grievance or civic issue directly with the department for standardized SLA tracking.
        </p>
      </div>

      <div className="max-w-[640px] mx-auto bg-white border border-[#E6ECF4] rounded-3xl p-6 sm:p-10 shadow-soft">
        
        {submittedRef && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl text-xs space-y-1 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Grievance Registered Successfully</span>
            </div>
            <p className="text-slate-700">Reference Number: <strong className="font-mono font-bold text-[#0B2A5B] text-sm">{submittedRef}</strong></p>
            <p className="text-slate-500">Track resolution progress under your Citizen Dashboard.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F1F3D] mb-1">
                Target Department <span className="text-rose-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-xs font-medium text-[#0F1F3D] bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
              >
                <option value="e-District Revenue Department">e-District Revenue Department</option>
                <option value="Department of Higher Education">Department of Higher Education</option>
                <option value="Municipal Corporation Civic Cell">Municipal Corporation Civic Cell</option>
                <option value="Transport Department (RTO)">Transport Department (RTO)</option>
                <option value="Social Welfare & Benefits">Social Welfare & Benefits</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F1F3D] mb-1">
                Grievance Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief title of the issue"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-xs font-medium text-[#0F1F3D] focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F1F3D] mb-1">
              Detailed Description of the Issue <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete details including application numbers or location info..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-xs font-medium text-[#0F1F3D] focus:outline-none focus:ring-2 focus:ring-[#0B2A5B] resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F1F3D] mb-1">
                District & Area <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={districtArea}
                onChange={(e) => setDistrictArea(e.target.value)}
                placeholder="e.g. Central District, Main Road"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-xs font-medium text-[#0F1F3D] focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F1F3D] mb-1">
                Urgency Level <span className="text-rose-500">*</span>
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-xs font-medium text-[#0F1F3D] bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
              >
                <option value="NORMAL">Normal (Standard 7 Days SLA)</option>
                <option value="URGENT">Urgent (Priority SLA)</option>
                <option value="CRITICAL">Critical (Immediate Escalation)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6ECF4] flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0B2A5B] hover:bg-[#12397A] text-white font-bold px-7 py-3 rounded-xl text-sm shadow-sm transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting Grievance...' : 'Submit Grievance'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
