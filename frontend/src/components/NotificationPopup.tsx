import React, { useState, useEffect } from 'react';
import { Bell, X, Sparkles, CheckCircle2, ChevronRight, MessageSquare, Smartphone, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const NotificationPopup: React.FC = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [showToast, setShowToast] = useState<boolean>(true);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState<boolean>(false);
  
  const [mobileNum, setMobileNum] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  const notifications = [
    {
      id: 1,
      title: isHindi ? 'पीएम सूर्य घर मुफ्त बिजली योजना 2026' : 'PM Surya Ghar Muft Bijli Yojana 2026',
      desc: isHindi ? '300 यूनिट मुफ्त बिजली और ₹78,000 डीबीटी सब्सिडी हेतु आवेदन शुरू।' : 'Applications active for 300 free electricity units & ₹78,000 DBT solar subsidy.',
      tag: isHindi ? 'नवीनतम योजना' : 'New Scheme 2026',
      date: 'Today',
      unread: true,
      link: '/services?search=Surya'
    },
    {
      id: 2,
      title: isHindi ? 'आयुष्मान वय वंदना 70+ वरिष्ठ नागरिक कार्ड' : 'Ayushman Vaya Vandana 70+ Senior Card',
      desc: isHindi ? '70 वर्ष से अधिक आयु के सभी नागरिकों हेतु ₹5 लाख मुफ्त कैशलेस इलाज।' : '₹5 Lakh free cashless treatment for all citizens aged 70+ without income cap.',
      tag: isHindi ? 'स्वास्थ्य मिशन' : 'Health Mission',
      date: 'Yesterday',
      unread: true,
      link: '/services?search=Ayushman'
    },
    {
      id: 3,
      title: isHindi ? 'विकसित भारत युवा इंटर्नशिप पोर्टल' : 'Viksit Bharat Yuva Internship 2026',
      desc: isHindi ? '₹5,000 प्रतिमाह वजीफे वाली 12-महीने की शीर्ष कॉर्पोरेट इंटर्नशिप।' : '12-month corporate internships with ₹5,000/mo stipend + ₹6,000 grant.',
      tag: isHindi ? 'युवा रोजगार' : 'Youth Scheme',
      date: '2 Days Ago',
      unread: true,
      link: '/services?search=Internship'
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNum.length >= 10) {
      setSubSuccess(true);
      setTimeout(() => {
        setShowSubscribeModal(false);
        setSubSuccess(false);
        setMobileNum('');
      }, 2500);
    }
  };

  return (
    <>
      {/* 1. Header Bell Launcher Icon */}
      <div className="relative">
        <button
          onClick={() => setShowDrawer(!showDrawer)}
          className="relative p-2 rounded-xl text-slate-700 hover:text-[#08234D] hover:bg-slate-100 transition-colors flex items-center justify-center border border-slate-200"
          aria-label="Government Bulletins"
        >
          <Bell className="w-5 h-5 text-[#08234D]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
            3
          </span>
        </button>

        {/* 2. Notification Center Dropdown Drawer */}
        {showDrawer && (
          <div className="absolute right-0 mt-3 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fadeIn">
            
            <div className="bg-[#08234D] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <h4 className="font-extrabold text-sm">
                  {isHindi ? 'सरकारी योजना एवं सेवा बुलेटिन (2026)' : 'Government Bulletins & Updates (2026)'}
                </h4>
              </div>
              <button onClick={() => setShowDrawer(false)} className="text-slate-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  to={n.link}
                  onClick={() => setShowDrawer(false)}
                  className="p-4 hover:bg-slate-50 transition-colors block group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {n.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 group-hover:text-[#08234D] flex items-center gap-1">
                    {n.title}
                    <ChevronRight className="w-3 h-3 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h5>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">{n.desc}</p>
                </Link>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setShowDrawer(false);
                  setShowSubscribeModal(true);
                }}
                className="text-[#08234D] font-extrabold hover:underline flex items-center gap-1"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isHindi ? 'व्हाट्सएप व एसएमएस अलर्ट पाएं' : 'Get Instant WhatsApp/SMS Alerts'}</span>
              </button>
            </div>

          </div>
        )}
      </div>

      {/* 3. Initial Auto-Toast Notification Floating Banner */}
      {showToast && (
        <div className="fixed top-20 right-4 z-40 max-w-sm sm:max-w-md bg-gradient-to-r from-[#08234D] to-[#0F346C] text-white p-4 rounded-2xl shadow-2xl border border-amber-400/40 animate-slideIn flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-full">
                {isHindi ? 'नई सरकारी सूचना' : 'Official Alert 2026'}
              </span>
            </div>
            <h4 className="font-extrabold text-xs mt-1 text-white">
              {isHindi ? 'नवीनतम सरकारी योजनाएं 2026 उपलब्ध!' : 'New 2026 Government Schemes Active!'}
            </h4>
            <p className="text-[11px] text-slate-200 mt-0.5 leading-snug">
              {isHindi
                ? 'पीएम सूर्य घर (300 यूनिट फ्री), आयुष्मान 70+ वरिष्ठ कार्ड और युवा इंटर्नशिप हेतु पात्रता जांचें।'
                : 'PM Surya Ghar, Ayushman 70+ Card & Yuva Internship applications are active now.'}
            </p>

            <div className="mt-2.5 flex items-center gap-3">
              <Link
                to="/services"
                onClick={() => setShowToast(false)}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-[11px] font-extrabold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>{isHindi ? 'योजनाएं देखें' : 'Explore Schemes'}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={() => setShowSubscribeModal(true)}
                className="text-[11px] font-bold text-amber-300 hover:underline"
              >
                {isHindi ? 'अलर्ट सब्सक्राइब करें' : 'Subscribe Alerts'}
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowToast(false)}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. WhatsApp / SMS Subscription Modal */}
      {showSubscribeModal && (
        <div className="modal-backdrop z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-modal overflow-hidden animate-fadeIn border border-slate-200">
            
            <div className="bg-[#08234D] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="font-extrabold text-base">
                    {isHindi ? 'सरकारी योजना अपडेट अलर्ट' : 'Subscribe to Scheme Alerts'}
                  </h3>
                  <p className="text-xs text-amber-300">
                    {isHindi ? 'व्हाट्सएप एवं मोबाइल पर सीधा अपडेट प्राप्त करें' : 'Direct notifications on WhatsApp & Mobile SMS'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubscribe} className="p-6 space-y-4">
              {subSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-extrabold text-sm">
                    {isHindi ? 'सफलतापूर्वक सब्सक्राइब किया गया!' : 'Successfully Subscribed!'}
                  </h4>
                  <p className="text-xs">
                    {isHindi
                      ? 'आपको सभी नए सरकारी नोटिफिकेशन व्हाट्सएप/एसएमएस पर मिलेंगे।'
                      : 'You will receive all new government service announcements on your registered mobile.'}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isHindi
                      ? 'भारत सरकार की नई योजनाओं, छात्रवृत्ति की समय-सीमा और सब्सिडी अपडेट के लिए अपना 10-अंकों का मोबाइल नंबर दर्ज करें।'
                      : 'Enter your 10-digit mobile number to receive instant WhatsApp and SMS alerts for new Central & State schemes.'}
                  </p>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">
                      {isHindi ? '10-अंकों का मोबाइल नंबर / व्हाट्सएप नंबर' : '10-Digit Mobile / WhatsApp Number'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">+91</span>
                      <input
                        type="tel"
                        value={mobileNum}
                        onChange={(e) => setMobileNum(e.target.value)}
                        placeholder="9876543210"
                        required
                        pattern="[0-9]{10}"
                        className="w-full pl-12 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#08234D]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isHindi ? 'सुरक्षित सरकारी अलर्ट डेटा - कोई स्पैम नहीं' : 'Encrypted official notifications • Zero spam'}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#08234D] hover:bg-[#0F346C] text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{isHindi ? 'फ्री अलर्ट चालू करें' : 'Activate Free Notifications'}</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                </>
              )}
            </form>

          </div>
        </div>
      )}
    </>
  );
};
