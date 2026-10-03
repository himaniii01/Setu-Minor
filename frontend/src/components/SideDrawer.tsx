import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X, Home, Grid, Award, Building2, Search, AlertCircle, Calculator,
  HelpCircle, UserCheck, Globe, LogIn, LayoutDashboard, Shield, FileText, LogOut
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  onOpenEligibility: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
  onOpenEligibility
}) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
  };

  const menuItems = [
    { label: 'Home Page', path: '/', icon: Home },
    { label: 'All Services Directory', path: '/services', icon: Grid },
    { label: 'Government Welfare Schemes', path: '/schemes', icon: Award },
    { label: 'Departments Directory', path: '/departments', icon: Building2 },
    { label: 'Track Application', path: '/track', icon: Search },
    { label: 'Grievances', path: '/grievances', icon: AlertCircle },
    { label: i18n.language === 'hi' ? 'दस्तावेज़ लॉकर (ऑर्गनाइजर)' : 'Official Document Organizer', path: '/vault', icon: FileText },
    { label: 'Check Eligibility Calculator', action: () => { onClose(); onOpenEligibility(); }, icon: Calculator },
    { label: 'Citizen Guidelines & FAQs', path: '/help', icon: HelpCircle },
  ];

  if (user) {
    menuItems.push(
      { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'My Citizen Profile', path: '/profile', icon: UserCheck },
      { label: 'Document Vault', path: '/vault', icon: FileText },
      { label: 'Consent Dashboard', path: '/consents', icon: Shield }
    );
    if (user.role === 'ADMIN') {
      menuItems.push({ label: 'Interoperability Health Monitor', path: '/admin/health', icon: Shield });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F1F3D]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Card Panel */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto animate-fadeIn">
        
        {/* Top Header & User Block */}
        <div className="p-6 bg-slate-50 border-b border-[#E6ECF4]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">SETU Navigation</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#0B2A5B] text-amber-400 flex items-center justify-center text-xl font-black shadow-sm ring-2 ring-emerald-500/20 uppercase">
              {user ? (user.profile?.full_name || user.email || 'U').charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#0F1F3D] text-base truncate">
                {user ? user.profile?.full_name : 'Citizen Guest'}
              </h3>
              <p className="text-xs text-[#64748B]">
                {user ? user.profile?.prototype_cit_id || user.email : 'Sign in to access personalized services'}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-4 px-3 space-y-1">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            if (item.action) {
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[15px] font-medium text-[#475569] hover:bg-slate-100 hover:text-[#0B2A5B] transition-colors text-left"
                >
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-[#0B2A5B]" />
                  <span>{item.label}</span>
                </button>
              );
            }
            return (
              <Link
                key={idx}
                to={item.path!}
                onClick={onClose}
                className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[15px] font-medium text-[#475569] hover:bg-slate-100 hover:text-[#0B2A5B] transition-colors"
              >
                <Icon className="w-5 h-5 text-slate-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Switch Language */}
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-medium text-[#475569] hover:bg-slate-100 transition-colors border-t border-[#E6ECF4] mt-3 pt-4"
          >
            <div className="flex items-center gap-3.5">
              <Globe className="w-5 h-5 text-slate-400" />
              <span>Switch Language</span>
            </div>
            <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2 py-1 rounded">
              {i18n.language === 'hi' ? 'हिंदी' : 'English'}
            </span>
          </button>
        </div>

        {/* Bottom Button */}
        <div className="p-4 border-t border-[#E6ECF4] bg-slate-50">
          {user ? (
            <button
              onClick={() => { logout(); onClose(); navigate('/'); }}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-xl shadow-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => { onClose(); onOpenLogin(); }}
              className="w-full flex items-center justify-center gap-2 bg-[#0B2A5B] hover:bg-[#12397A] text-white font-semibold py-3 rounded-xl shadow-sm transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Citizen Login / Register</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
