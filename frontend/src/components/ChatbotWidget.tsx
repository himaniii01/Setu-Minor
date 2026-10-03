import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actionLink?: { label: string; url: string };
}

export const ChatbotWidget: React.FC = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: ChatMessage[] = [
    {
      id: '1',
      sender: 'bot',
      text: isHindi
        ? 'नमस्ते! मैं **सेतु मित्र** हूँ, आपका 2026 डिजिटल सरकारी सेवा सहायक। मैं योजनाओं, आवेदन प्रक्रिया, पात्रता और DigiLocker से जुड़े सवालों में आपकी मदद कर सकता हूँ।'
        : 'Namaste! I am **SETU AI Mitra**, your 2026 digital citizen guide. How can I help you explore schemes, check eligibility, or track applications today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const quickPrompts = [
    { label: isHindi ? 'सोलर सब्सिडी 2026' : 'PM Surya Ghar 2026', query: 'Tell me about PM Surya Ghar Muft Bijli Yojana 2026' },
    { label: isHindi ? 'आयुष्मान 70+ कार्ड' : 'Ayushman 70+ Card', query: 'How to get Ayushman Vaya Vandana 70+ Senior Citizen Card?' },
    { label: isHindi ? 'युवा इंटर्नशिप योजना' : 'Yuva Internship 2026', query: 'What is Viksit Bharat Yuva Internship Scheme?' },
    { label: isHindi ? 'आवेदन ट्रैक करें' : 'Track Application', query: 'How do I track my submitted application status?' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');

    // Process Bot Response
    setTimeout(() => {
      const botResponse = generateBotAnswer(query, isHindi);
      setMessages((prev) => [...prev, botResponse]);
    }, 600);
  };

  const generateBotAnswer = (q: string, isHi: boolean): ChatMessage => {
    const lower = q.toLowerCase();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (lower.includes('surya') || lower.includes('solar') || lower.includes('सोलर') || lower.includes('बिजली')) {
      return {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: isHi
          ? '☀️ **पीएम सूर्य घर: मुफ्त बिजली योजना 2026**\n\n- **लाभ**: 300 यूनिट तक मुफ्त बिजली/माह और ₹78,000 तक की प्रत्यक्ष डीबीटी सब्सिडी।\n- **पात्रता**: खुद का पक्का मकान और छत स्थान उपलब्ध होना चाहिए।\n- **दस्तावेज़**: बिजली बिल, आधार कार्ड और बैंक पासबुक।'
          : '☀️ **PM Surya Ghar: Muft Bijli Yojana 2026**\n\n- **Benefits**: Up to 300 units of free electricity/month & direct DBT subsidy up to ₹78,000.\n- **Eligibility**: Indian citizens owning a suitable residential rooftop.\n- **Required Documents**: Electricity bill copy, Aadhaar card & Bank Account details.',
        timestamp: now,
        actionLink: { label: isHi ? 'सोलर योजना देखें' : 'View Solar Scheme', url: '/services?search=Surya' }
      };
    }

    if (lower.includes('ayushman') || lower.includes('70') || lower.includes('health') || lower.includes('आयुष्मान') || lower.includes('स्वास्थ्य')) {
      return {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: isHi
          ? '🏥 **आयुष्मान वय वंदना 70+ कार्ड (2026)**\n\n- **लाभ**: 70 वर्ष से अधिक आयु के सभी वरिष्ठ नागरिकों को ₹5 लाख/वर्ष का मुफ्त कैशलेस इलाज।\n- **पात्रता**: आयु 70 वर्ष या अधिक (बिना किसी आय सीमा के)।\n- **प्राप्ति**: बायोमेट्रिक/आधार e-KYC के माध्यम से 5 मिनट में डिजिटल कार्ड जारी।'
          : '🏥 **Ayushman Vaya Vandana 70+ Card (2026)**\n\n- **Benefits**: ₹5 Lakh/year top-up cashless hospital treatment for senior citizens aged 70+.\n- **Eligibility**: All seniors aged 70+ irrespective of family income level.\n- **Issuance**: Instant digital issuance via UIDAI e-KYC.',
        timestamp: now,
        actionLink: { label: isHi ? 'आयुष्मान कार्ड आवेदन' : 'Apply Ayushman 70+', url: '/services?search=Ayushman' }
      };
    }

    if (lower.includes('internship') || lower.includes('yuva') || lower.includes('युवा') || lower.includes('इंटर्नशिप')) {
      return {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: isHi
          ? '🎓 **विकसित भारत युवा इंटर्नशिप 2026**\n\n- **लाभ**: 12 महीने की शीर्ष कॉर्पोरेट इंटर्नशिप, ₹5,000/माह वजीफा + ₹6,000 एकमुश्त सहायता।\n- **पात्रता**: आयु 21-24 वर्ष, स्नातक या डिप्लोमा धारक।'
          : '🎓 **Viksit Bharat Yuva Internship 2026**\n\n- **Benefits**: 12-month internship in top 500 companies, ₹5,000 monthly stipend + ₹6,000 one-time grant.\n- **Eligibility**: Youth aged 21-24 with Graduation or Diploma.',
        timestamp: now,
        actionLink: { label: isHi ? 'युवा पोर्टल' : 'Explore Internships', url: '/services?search=Internship' }
      };
    }

    if (lower.includes('track') || lower.includes('status') || lower.includes('ट्रैक') || lower.includes('स्थिति')) {
      return {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: isHi
          ? '🔍 **आवेदन स्थिति ट्रैकिंग**\n\nआप अपने 14-अंकों के SETU आवेदन संदर्भ नंबर (उदा. SETU-APP-2026-8812) से रीयल-टाइम स्थिति जांच सकते हैं।'
          : '🔍 **Track Application Status**\n\nYou can track your application in real-time using your 14-digit SETU Reference Number (e.g. SETU-APP-2026-8812).',
        timestamp: now,
        actionLink: { label: isHi ? 'ट्रैक पेज पर जाएं' : 'Go to Tracking Page', url: '/track' }
      };
    }

    return {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: isHi
        ? 'मैं समझ गया! आप SETU पोर्टल की **सेवा निर्देशिका (Services Directory)** पर जाकर 14+ केंद्रीय व राज्य योजनाओं की खोज कर सकते हैं या पात्रता कैलकुलेटर का उपयोग कर सकते हैं।'
        : 'Got it! You can explore all 14+ central & state schemes on the **Services Directory**, or check scheme eligibility using our interactive calculator.',
      timestamp: now,
      actionLink: { label: isHi ? 'सेवाएं देखें' : 'View Services', url: '/services' }
    };
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-gradient-to-r from-[#08234D] to-[#113B7A] text-white px-5 py-3.5 rounded-full shadow-2xl hover:scale-105 transition-all border border-amber-400/40"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-400 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
              {isHindi ? 'सेतु मित्र AI' : 'SETU AI Mitra'}
            </p>
            <p className="text-[11px] text-slate-200 font-medium">
              {isHindi ? 'सरकारी योजना सहायक' : 'Citizen Helpdesk'}
            </p>
          </div>
        </button>
      )}

      {/* Chatbox Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#08234D] via-[#0F346C] to-[#12397A] p-4 text-white flex items-center justify-between border-b border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-white">
                  {isHindi ? 'सेतु मित्र (AI सहायक)' : 'SETU AI Citizen Assistant'}
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {isHindi ? 'ऑनलाइन • 2026 सहायता' : 'Online • 2026 Helplines Active'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-[#08234D] text-amber-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    AI
                  </div>
                )}

                <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#08234D] text-white rounded-br-none shadow-sm'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  {msg.actionLink && (
                    <Link
                      to={msg.actionLink.url}
                      onClick={() => setIsOpen(false)}
                      className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
                    >
                      <span>{msg.actionLink.label}</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}

                  <span className={`block text-[9px] mt-1 text-right ${
                    msg.sender === 'user' ? 'text-slate-300' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                className="shrink-0 text-[10px] font-semibold bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 px-2.5 py-1 rounded-full border border-slate-200 transition-colors flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3 text-amber-600" />
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isHindi ? 'योजना या सेवा का नाम लिखें...' : 'Ask about any 2026 scheme or service...'}
              className="flex-1 bg-slate-100 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#08234D]"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2.5 bg-[#08234D] hover:bg-[#0F346C] text-white rounded-xl transition-colors shrink-0 shadow-sm"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
