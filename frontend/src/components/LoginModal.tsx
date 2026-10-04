import React, { useState } from 'react';
import { X, LogIn, AlertCircle, ShieldCheck, CheckCircle2, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);

  // Form State
  const [identifier, setIdentifier] = useState<string>('rajesh123@gmail.com');
  const [password, setPassword] = useState<string>('Password123!');
  const [fullName, setFullName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');

  // Aadhaar e-KYC State
  const [aadhaarNum, setAadhaarNum] = useState<string>('548912349821');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [aadhaarOtp, setAadhaarOtp] = useState<string>('123456');
  const [aadhaarVerified, setAadhaarVerified] = useState<boolean>(false);
  const [aadhaarLoading, setAadhaarLoading] = useState<boolean>(false);
  const [maskedMobile, setMaskedMobile] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSendAadhaarOtp = async () => {
    setErrorMsg('');
    const cleanNum = aadhaarNum.replace(/\D/g, '');
    if (cleanNum.length !== 12) {
      setErrorMsg('Please enter a valid 12-digit Aadhaar Number');
      return;
    }
    setAadhaarLoading(true);
    try {
      const res = await api.post('/auth/verify-aadhaar', { aadhaar_number: cleanNum });
      setOtpSent(true);
      setMaskedMobile(res.data.masked_mobile || '******9821');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Aadhaar OTP request failed');
    } finally {
      setAadhaarLoading(false);
    }
  };

  const handleVerifyAadhaarOtp = async () => {
    setErrorMsg('');
    const cleanNum = aadhaarNum.replace(/\D/g, '');
    setAadhaarLoading(true);
    try {
      const res = await api.post('/auth/verify-aadhaar', {
        aadhaar_number: cleanNum,
        otp: aadhaarOtp
      });
      if (res.data.verified) {
        setAadhaarVerified(true);
        if (res.data.ekyc_data) {
          setFullName(res.data.ekyc_data.full_name || 'Rajesh Kumar');
          setMobileNumber('9876543210');
          if (!identifier || identifier === 'rajesh123@gmail.com') {
            setIdentifier('rajesh123@gmail.com');
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Invalid Aadhaar OTP');
    } finally {
      setAadhaarLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isRegisterMode) {
        await register({
          email: identifier || 'rajesh123@gmail.com',
          mobile_number: mobileNumber || `9${Math.floor(100000000 + Math.random() * 900000000)}`,
          password,
          full_name: fullName || 'Rajesh Kumar',
          aadhaar_verified: aadhaarVerified
        });
      } else {
        await login(identifier, password);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCitizen = () => {
    setIdentifier('rajesh123@gmail.com');
    setPassword('Password123!');
    setIsRegisterMode(false);
    setErrorMsg('');
  };

  const fillDemoAdmin = () => {
    setIdentifier('admin@setu.gov.in');
    setPassword('AdminPass123!');
    setIsRegisterMode(false);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[90vh]">

        {/* Header with Official National Emblem Seal */}
        <div className="bg-gradient-to-r from-[#08234D] via-[#0B2A5B] to-[#12397A] text-white p-5 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 bg-[#08234D] flex items-center justify-center shrink-0">
              <img src="/india_gov_emblem.jpg" alt="Government of India Emblem" className="w-full h-full object-cover scale-[1.35]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">SETU Citizen Gateway</h3>
              <p className="text-[11px] text-amber-300 font-medium">सत्यमेव जयते • Government of India</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector: Login vs Register */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => { setIsRegisterMode(false); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${!isRegisterMode
                ? 'bg-[#08234D] text-white shadow-sm ring-2 ring-[#08234D]/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Citizen Login (साइन इन)</span>
          </button>

          <button
            type="button"
            onClick={() => { setIsRegisterMode(true); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${isRegisterMode
                ? 'bg-[#08234D] text-white shadow-sm ring-2 ring-[#08234D]/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register with Aadhaar (नया पंजीकरण)</span>
          </button>
        </div>

      

       {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">

            {/* REGISTER MODE: AADHAAR E-KYC SECTION */}
            {isRegisterMode && (
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>UIDAI Aadhaar e-KYC Verification</span>
                  </span>
                  {aadhaarVerified && (
                    <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {!aadhaarVerified ? (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        12-Digit Aadhaar Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={aadhaarNum}
                          onChange={(e) => setAadhaarNum(e.target.value)}
                          placeholder="5489 1234 9821"
                          maxLength={14}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
                        />
                        {!otpSent && (
                          <button
                            type="button"
                            onClick={handleSendAadhaarOtp}
                            disabled={aadhaarLoading}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold px-3 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
                          >
                            {aadhaarLoading ? 'Sending...' : 'Get OTP'}
                          </button>
                        )}
                      </div>
                    </div>

                    {otpSent && (
                      <div className="space-y-2 pt-1">
                        <p className="text-[11px] text-slate-600">
                          Enter 6-digit OTP sent to UIDAI registered mobile <strong className="font-mono text-emerald-800">{maskedMobile}</strong> (Demo OTP: <strong className="font-mono">123456</strong>):
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={aadhaarOtp}
                            onChange={(e) => setAadhaarOtp(e.target.value)}
                            placeholder="123456"
                            maxLength={6}
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold tracking-widest text-center focus:ring-2 focus:ring-emerald-600 outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyAadhaarOtp}
                            disabled={aadhaarLoading}
                            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
                          >
                            {aadhaarLoading ? 'Verifying...' : 'Verify OTP'}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-emerald-900 space-y-1">
                    <p className="font-extrabold">✓ UIDAI Identity Confirmed!</p>
                    <p className="text-[11px] text-emerald-800">
                      Fetched: <strong>Rajesh Kumar</strong> • DOB: 15/08/1995 • Male
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* REGISTER MODE: FULL NAME */}
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#08234D] outline-none"
                />
              </div>
            )}

            {/* REGISTER OR LOGIN: EMAIL / CITIZEN ID */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Registered Email / Citizen ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. rajesh123@gmail.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#08234D] outline-none"
              />
            </div>

            {/* REGISTER MODE: MOBILE NUMBER */}
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Mobile Number (10 digits) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                  pattern="[0-9]{10}"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#08234D] outline-none"
                />
              </div>
            )}

            {/* REGISTER OR LOGIN: PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-[#08234D] outline-none"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#08234D] hover:bg-[#0F346C] text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 border border-amber-500/30 cursor-pointer"
            >
              {loading ? 'Authenticating...' : isRegisterMode ? 'Complete Registration & Login' : 'Verify & Login'}
            </button>

            {/* BOTTOM SWITCHER LINK */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => { setIsRegisterMode(!isRegisterMode); setErrorMsg(''); }}
                className="text-[#08234D] hover:underline font-bold cursor-pointer"
              >
                {isRegisterMode ? 'Already registered? Switch to Login' : 'New citizen? Register with Aadhaar'}
              </button>
              <button
                type="button"
                onClick={() => alert('Demo prototype credentials: rajesh123@gmail.com / Password123!')}
                className="text-slate-400 hover:underline cursor-pointer"
              >
                Need help?
              </button>
            </div>
          </form>

        </div>

        {/* Footer info badge */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>UIDAI Verified e-KYC Sandbox • SETU Gateway</span>
        </div>

      </div>
    </div>
  );
};
