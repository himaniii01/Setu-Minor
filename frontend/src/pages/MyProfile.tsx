import React, { useState } from 'react';
import { UserCheck, Save, ShieldCheck, Mail, Phone, Camera, CheckCircle2, BadgeCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const MyProfile: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState<string>(user?.profile?.full_name || 'Rajesh Kumar');
  const [email, setEmail] = useState<string>(user?.email || 'rajeshkumar@gmail.com');
  const [mobileNumber, setMobileNumber] = useState<string>(user?.mobile_number || '9876543210');
  const [dob, setDob] = useState<string>(user?.profile?.dob || '1995-08-15');
  const [gender, setGender] = useState<string>(user?.profile?.gender || 'Male');
  const [address, setAddress] = useState<string>(user?.profile?.demo_address || 'Flat 402, Green Valley Apartments, Sector 12');
  const [district, setDistrict] = useState<string>(user?.profile?.district || 'Central District');
  const [income, setIncome] = useState<string>(String(user?.profile?.annual_income || 140000));
  const [category, setCategory] = useState<string>(user?.profile?.category || 'BC');

  const [saving, setSaving] = useState<boolean>(false);
  const [version, setVersion] = useState<number>(user?.profile?.version || 1);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await api.patch('/profile', {
        full_name: fullName,
        dob,
        gender,
        demo_address: address,
        district,
        annual_income: Number(income),
        category
      });

      setVersion(res.data.profile.version);
      showToast('Profile Updated', `Profile updated to version v${res.data.profile.version}`, 'success');
    } catch (err: any) {
      showToast('Error', err.response?.data?.error?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E6ECF4] pb-4 gap-2">
        <div>
          <h1 className="text-3xl font-black text-[#0B2A5B] tracking-tight">Citizen Profile & Identity</h1>
          <p className="text-slate-500 text-xs mt-1">Single verified citizen identity pre-filled across all SETU gateway applications</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-mono bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span>e-KYC VERIFIED</span>
          </span>
          <span className="text-xs font-bold font-mono bg-blue-50 text-[#0B2A5B] px-3 py-1.5 rounded-full border border-blue-200">
            Version v{version}
          </span>
        </div>
      </div>

      <div className="bg-white border border-[#E6ECF4] rounded-3xl p-6 sm:p-10 shadow-soft space-y-8">
        
        {/* Top Profile Header Card with Photo */}
        <div className="bg-gradient-to-r from-[#08234D] to-[#12397A] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden border border-amber-400/30">
          
          {/* Avatar Photo with Badge */}
          <div className="relative shrink-0 group">
            <div className="w-28 h-28 rounded-2xl border-4 border-amber-400 bg-[#08234D] text-amber-400 flex items-center justify-center font-black text-5xl shadow-xl shrink-0 uppercase">
              {(fullName || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-[#08234D] shadow-md" title="Verified Photo">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Profile Name & Primary Details */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border border-amber-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Citizen Account</span>
            </div>
            <h2 className="text-2xl font-black tracking-wide text-white">{fullName}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-200">
              <span className="flex items-center gap-1 font-mono">
                <Mail className="w-3.5 h-3.5 text-amber-300" />
                <span>{email}</span>
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span>+91 {mobileNumber}</span>
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 text-center text-xs space-y-0.5 shrink-0">
            <span className="text-[10px] text-slate-300 font-mono uppercase block">SETU Citizen ID</span>
            <strong className="text-amber-300 font-mono text-sm tracking-wider">{user.profile?.prototype_cit_id || 'SETU-CIT-000123'}</strong>
          </div>

        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F1F3D] mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-xs font-medium text-[#0F1F3D] focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F1F3D] mb-1">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-xs font-medium text-[#0F1F3D] focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F1F3D] mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-xs font-mono font-bold text-[#0B2A5B] bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F1F3D] mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-xs font-mono text-[#0F1F3D] focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F1F3D] mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-xs font-medium text-[#0F1F3D] bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F1F3D] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-xs font-medium text-[#0F1F3D] bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
              >
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="BC">BC / OBC</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F1F3D] mb-1">Annual Income (₹)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-xs font-medium text-[#0F1F3D] focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F1F3D] mb-1">Residential Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-xs font-medium text-[#0F1F3D] focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
            />
          </div>

          <div className="pt-4 border-t border-[#E6ECF4] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#0B2A5B] hover:bg-[#12397A] text-white font-extrabold px-7 py-3 rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

