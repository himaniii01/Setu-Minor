import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Menu, LogIn, User as UserIcon, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

import { NotificationPopup } from './NotificationPopup';

interface HeaderProps {
  onOpenDrawer: () => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDrawer, onOpenLogin }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
  };

  const navItems = [
    { label: i18n.language === 'hi' ? 'मुख्य' : 'Home', path: '/' },
    { label: i18n.language === 'hi' ? 'सेवाएं' : 'Services', path: '/services' },
    { label: i18n.language === 'hi' ? 'योजनाएं' : 'Schemes', path: '/schemes' },
    { label: i18n.language === 'hi' ? 'दस्तावेज़' : 'Documents', path: '/vault' },
    { label: i18n.language === 'hi' ? 'ट्रैक' : 'Track', path: '/track' },
    { label: i18n.language === 'hi' ? 'शिकायतें' : 'Grievances', path: '/grievances' },
    { label: i18n.language === 'hi' ? 'सहायता' : 'Help', path: '/help' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Official Government Seal & SETU Wordmark */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500/40 shadow-sm group-hover:scale-105 transition-transform bg-[#08234D] flex items-center justify-center shrink-0">
            <img
              src="/india_gov_emblem.jpg"
              alt="SETU Government of India Emblem Logo"
              className="w-full h-full object-cover scale-100"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-[#08234D] tracking-tight">SETU</span>
              <span className="text-[9px] font-extrabold bg-amber-500 text-slate-950 px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                GOVT GATEWAY
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold leading-none mt-0.5 flex items-center gap-1">
              <span>सत्यमेव जयते</span>
              <span>•</span>
              <span>Interoperability Portal</span>
            </p>
          </div>
        </Link>

        {/* Center: Nav Links */}
        <nav className="hidden xl:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`text-xs font-extrabold transition-colors py-1 border-b-2 ${
                  isActive ? 'border-[#08234D] text-[#08234D]' : 'border-transparent text-slate-700 hover:text-[#08234D]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          
          {/* User Status / Login Button */}
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] px-3 py-1.5 rounded-xl text-sm font-bold transition-all border border-slate-200"
            >
              <div className="w-7 h-7 rounded-full bg-[#08234D] text-amber-400 font-black flex items-center justify-center text-xs shrink-0 border border-amber-400 uppercase">
                {(user.profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline max-w-[120px] truncate text-xs text-[#08234D]">
                {user.profile?.full_name || 'Rajesh Kumar'}
              </span>
            </Link>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 bg-[#08234D] hover:bg-[#0F346C] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all hover:shadow-gold duration-150 border border-amber-500/30"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>{t('nav.login')}</span>
            </button>
          )}

          {/* Notification Popup & Bulletins */}
          <NotificationPopup />

          {/* Language Selector */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#0F172A] px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
            title="Switch Language"
          >
            <Globe className="w-4 h-4 text-amber-600" />
            <span>{i18n.language === 'hi' ? 'हिंदी' : 'English'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Hamburger Side Drawer Button */}
          <button
            onClick={onOpenDrawer}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Open side menu"
          >
            <Menu className="w-6 h-6 text-[#08234D]" />
          </button>
        </div>
      </div>
    </header>
  );
};
