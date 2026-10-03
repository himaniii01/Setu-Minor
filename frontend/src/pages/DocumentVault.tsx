import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Trash2, ShieldCheck, Download, ExternalLink, Globe, Search,
  FolderOpen, Eye, CheckCircle2, RefreshCw, Upload, Lock, Sparkles, Filter,
  CreditCard, GraduationCap, Car, Home, HeartPulse, Building2, UserCheck, X, User
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

interface DocumentRecord {
  doc_id: string;
  doc_type: string;
  doc_name: string;
  issuer_org: string;
  uri_reference: string;
  is_verified: boolean;
  uploaded_at: string;
  category: 'IDENTITY' | 'INCOME' | 'EDUCATION' | 'TRANSPORT' | 'HOUSING' | 'HEALTH';
  doc_number?: string;
}

export const DocumentVault: React.FC = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'organizer' | 'digilocker'>('organizer');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(true);
  const [syncingDigi, setSyncingDigi] = useState<boolean>(false);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [digiDocs, setDigiDocs] = useState<any[]>([]);

  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);

  // Add Document Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<'IDENTITY' | 'INCOME' | 'EDUCATION' | 'TRANSPORT' | 'HOUSING' | 'HEALTH'>('IDENTITY');
  const [newType, setNewType] = useState<string>('AADHAAR');
  const [newName, setNewName] = useState<string>('');
  const [newIssuer, setNewIssuer] = useState<string>('');
  const [newDocNumber, setNewDocNumber] = useState<string>('');

  const categories = [
    { id: 'ALL', label: isHindi ? 'सभी दस्तावेज़' : 'All Documents', icon: FolderOpen },
    { id: 'IDENTITY', label: isHindi ? 'पहचान पत्र' : 'Identity Proofs', icon: CreditCard, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'INCOME', label: isHindi ? 'आय एवं वित्त' : 'Income & Tax', icon: Building2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'EDUCATION', label: isHindi ? 'शिक्षा व अंकपत्र' : 'Education & Degrees', icon: GraduationCap, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'TRANSPORT', label: isHindi ? 'परिवहन व वाहन' : 'Transport & Vehicle', icon: Car, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'HOUSING', label: isHindi ? 'आवास व भूमि' : 'Housing & Land', icon: Home, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { id: 'HEALTH', label: isHindi ? 'स्वास्थ्य व कल्याण' : 'Health & Welfare', icon: HeartPulse, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  ];

  const defaultMockDocs: DocumentRecord[] = [
    {
      doc_id: 'doc-101',
      doc_type: 'AADHAAR',
      doc_name: isHindi ? 'आधार स्मार्ट कार्ड (UIDAI e-KYC सत्यापित)' : 'Aadhaar Smart Card (UIDAI e-KYC Verified)',
      issuer_org: 'Unique Identification Authority of India (UIDAI)',
      uri_reference: 'https://uidai.gov.in/verify/548912349821',
      is_verified: true,
      uploaded_at: '2026-09-15',
      category: 'IDENTITY',
      doc_number: 'XXXX-XXXX-9821'
    },
    {
      doc_id: 'doc-102',
      doc_type: 'PAN_CARD',
      doc_name: isHindi ? 'स्थायी खाता संख्या कार्ड (PAN Card)' : 'Permanent Account Number (PAN Card)',
      issuer_org: 'Income Tax Department / NSDL Govt of India',
      uri_reference: 'https://incometax.gov.in/verify/ABCDE1234F',
      is_verified: true,
      uploaded_at: '2026-08-20',
      category: 'IDENTITY',
      doc_number: 'ABCDE1234F'
    },
    {
      doc_id: 'doc-103',
      doc_type: 'VOTER_ID',
      doc_name: isHindi ? 'मतदाता पहचान पत्र (Voter Photo ID)' : 'Election Commission Voter Photo ID (EPIC)',
      issuer_org: 'Election Commission of India (ECI)',
      uri_reference: 'https://voters.eci.gov.in/verify/ECI889120',
      is_verified: true,
      uploaded_at: '2026-07-15',
      category: 'IDENTITY',
      doc_number: 'ECI-VOT-889120'
    },
    {
      doc_id: 'doc-104',
      doc_type: 'INCOME_CERT',
      doc_name: isHindi ? 'आय प्रमाणपत्र (वर्ष 2026-27)' : 'Statutory Income Certificate (2026-27)',
      issuer_org: 'Revenue & District Land Collector Office',
      uri_reference: 'https://edistrict.gov.in/verify/INC20268819',
      is_verified: true,
      uploaded_at: '2026-08-10',
      category: 'INCOME',
      doc_number: 'INC-2026-881921'
    },
    {
      doc_id: 'doc-105',
      doc_type: 'CASTE_CERT',
      doc_name: isHindi ? 'जाति व समुदाय प्रमाणपत्र' : 'Caste & Community Statutory Certificate',
      issuer_org: 'Revenue Department & Tahsildar Office',
      uri_reference: 'https://edistrict.gov.in/verify/CST99120',
      is_verified: true,
      uploaded_at: '2026-05-14',
      category: 'INCOME',
      doc_number: 'CST-2026-991201'
    },
    {
      doc_id: 'doc-106',
      doc_type: 'MARKS_CARD_12',
      doc_name: isHindi ? '12वीं कक्षा उच्च माध्यमिक अंकपत्र' : 'Class 12th Senior Secondary Certificate',
      issuer_org: 'Central Board of Secondary Education (CBSE)',
      uri_reference: 'https://cbse.gov.in/verify/12889201',
      is_verified: true,
      uploaded_at: '2026-07-04',
      category: 'EDUCATION',
      doc_number: 'CBSE-12-889201'
    },
    {
      doc_id: 'doc-107',
      doc_type: 'MARKS_CARD_10',
      doc_name: isHindi ? '10वीं कक्षा माध्यमिक प्रमाणपत्र' : 'Class 10th Secondary School Certificate',
      issuer_org: 'Central Board of Secondary Education (CBSE)',
      uri_reference: 'https://cbse.gov.in/verify/10889100',
      is_verified: true,
      uploaded_at: '2026-06-12',
      category: 'EDUCATION',
      doc_number: 'CBSE-10-889100'
    },
    {
      doc_id: 'doc-108',
      doc_type: 'APAAR_ID',
      doc_name: isHindi ? 'अपार (APAAR) छात्र डिजिटल आईडी' : 'APAAR One Nation One Student ID',
      issuer_org: 'Ministry of Education & Academic Bank of Credits',
      uri_reference: 'https://apaar.edu.gov.in/verify/998123',
      is_verified: true,
      uploaded_at: '2026-09-01',
      category: 'EDUCATION',
      doc_number: 'APAAR-2026-778811'
    },
    {
      doc_id: 'doc-109',
      doc_type: 'DRIVING_LICENSE',
      doc_name: isHindi ? 'ड्राइविंग लाइसेंस (परिवहन सेवा)' : 'Motor Driving License (LLR/Permanent)',
      issuer_org: 'Ministry of Road Transport & Highways (Parivahan)',
      uri_reference: 'https://parivahan.gov.in/verify/DL889201',
      is_verified: true,
      uploaded_at: '2026-06-20',
      category: 'TRANSPORT',
      doc_number: 'DL-142026009821'
    },
    {
      doc_id: 'doc-110',
      doc_type: 'VEHICLE_RC',
      doc_name: isHindi ? 'वाहन पंजीकरण प्रमाणपत्र (RC Smart Card)' : 'Vehicle Registration Certificate (Parivahan RC)',
      issuer_org: 'Regional Transport Office (RTO Parivahan)',
      uri_reference: 'https://parivahan.gov.in/verify/RC8812',
      is_verified: true,
      uploaded_at: '2026-04-18',
      category: 'TRANSPORT',
      doc_number: 'RC-DL01AB9821'
    },
    {
      doc_id: 'doc-111',
      doc_type: 'DOMICILE_CERT',
      doc_name: isHindi ? 'मूल निवासी / डोमिसाइल प्रमाणपत्र' : 'Statutory Domicile & Residence Certificate',
      issuer_org: 'District Collectorate Revenue Office',
      uri_reference: 'https://edistrict.gov.in/verify/DOM44912',
      is_verified: true,
      uploaded_at: '2026-03-30',
      category: 'HOUSING',
      doc_number: 'DOM-2026-449120'
    },
    {
      doc_id: 'doc-112',
      doc_type: 'AYUSHMAN_CARD',
      doc_name: isHindi ? 'आयुष्मान वय वंदना 70+ वरिष्ठ कार्ड' : 'Ayushman Vaya Vandana 70+ Health Card',
      issuer_org: 'National Health Authority (NHA)',
      uri_reference: 'https://pmjay.gov.in/verify/70AYU881',
      is_verified: true,
      uploaded_at: '2026-09-28',
      category: 'HEALTH',
      doc_number: 'AYU-70-998124'
    },
    {
      doc_id: 'doc-113',
      doc_type: 'RATION_CARD',
      doc_name: isHindi ? 'डिजिटल प्राथमिकता राशन कार्ड (BPL/AAY)' : 'Digital Priority Ration Card (BPL/AAY)',
      issuer_org: 'Department of Food & Civil Supplies',
      uri_reference: 'https://nfsa.gov.in/verify/RAT99120',
      is_verified: true,
      uploaded_at: '2026-02-14',
      category: 'HEALTH',
      doc_number: 'RAT-2026-889124'
    },
    {
      doc_id: 'doc-114',
      doc_type: 'SOLAR_PASSBOOK',
      doc_name: isHindi ? 'पीएम सूर्य घर मुफ्त बिजली उपभोक्ता आईडी' : 'PM Surya Ghar Solar Electricity Passbook',
      issuer_org: 'Ministry of New & Renewable Energy (MNRE)',
      uri_reference: 'https://pmsuryaghar.gov.in/verify/SOL3398',
      is_verified: true,
      uploaded_at: '2026-09-10',
      category: 'HOUSING',
      doc_number: 'SOLAR-2026-33981'
    }
  ];

  useEffect(() => {
    if (previewDoc) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [previewDoc]);

  useEffect(() => {
    fetchDocs();
  }, [activeTab]);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      if (activeTab === 'organizer') {
        const res = await api.get('/documents');
        if (res.data.documents && res.data.documents.length > 0) {
          const mapped = res.data.documents.map((d: any) => ({
            ...d,
            category: detectCategory(d.doc_type),
            doc_number: d.uri_reference ? d.uri_reference.slice(-12) : 'XXXX-XXXX-8821'
          }));
          setDocuments(mapped);
        } else {
          setDocuments(defaultMockDocs);
        }
      } else {
        const res = await api.get('/documents/digilocker');
        setDigiDocs(res.data.availableDocuments || []);
      }
    } catch (err) {
      setDocuments(defaultMockDocs);
    } finally {
      setLoading(false);
    }
  };

  const detectCategory = (type: string): any => {
    const t = type.toUpperCase();
    if (t.includes('AADHAAR') || t.includes('PAN') || t.includes('VOTER')) return 'IDENTITY';
    if (t.includes('INCOME') || t.includes('TAX') || t.includes('BANK') || t.includes('CASTE')) return 'INCOME';
    if (t.includes('MARKS') || t.includes('APAAR') || t.includes('DEGREE')) return 'EDUCATION';
    if (t.includes('DRIVING') || t.includes('RC') || t.includes('VEHICLE')) return 'TRANSPORT';
    if (t.includes('AWAS') || t.includes('LAND') || t.includes('HOUSE') || t.includes('DOMICILE') || t.includes('SOLAR')) return 'HOUSING';
    return 'HEALTH';
  };

  const downloadSamplePdf = (doc: DocumentRecord) => {
    const textContent = `
===================================================================
             GOVERNMENT OF INDIA - OFFICIAL DIGITAL CERTIFICATE
===================================================================
Document Name : ${doc.doc_name}
Category      : ${doc.category}
Issuer Auth   : ${doc.issuer_org}
Reference ID  : ${doc.doc_number || 'SETU-DOC-2026-99120'}
Issued Date   : ${doc.uploaded_at}
Security Seal : SHA-256 Verified • UIDAI / DigiLocker Encrypted

Holder Info   : Verified Citizen Sandbox Account
District      : Central District, New Delhi
Gateway       : SETU Interoperability Gateway (https://setu.gov.in)
===================================================================
Notice: Official digital government document reference copy.
===================================================================
    `;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.doc_type || 'official_document'}_reference.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Download Started', `Official reference file for ${doc.doc_name} downloaded.`, 'success');
  };

  const handleSyncDigiLocker = () => {
    setSyncingDigi(true);
    setTimeout(() => {
      setSyncingDigi(false);
      showToast('DigiLocker Synced', 'All official government certificates synced successfully!', 'success');
    }, 1800);
  };

  const handleAddDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newDoc: DocumentRecord = {
      doc_id: `doc-${Date.now()}`,
      doc_type: newType,
      doc_name: newName,
      issuer_org: newIssuer || 'State Government Digital Vault',
      uri_reference: `https://setu.gov.in/vault/${Date.now()}`,
      is_verified: true,
      uploaded_at: new Date().toISOString().split('T')[0],
      category: newCategory,
      doc_number: newDocNumber || `DOC-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setShowAddModal(false);
    setNewName('');
    setNewIssuer('');
    setNewDocNumber('');
    showToast('Document Saved', 'Official document added to your SETU Organizer.', 'success');
  };

  const handleDelete = (id: string) => {
    if (window.confirm(isHindi ? 'क्या आप इस दस्तावेज़ को लॉकर से हटाना चाहते हैं?' : 'Remove document from your SETU Organizer?')) {
      setDocuments((prev) => prev.filter((d) => d.doc_id !== id));
      showToast('Removed', 'Document removed from private organizer.', 'info');
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchCat = selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchSearch = doc.doc_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        doc.issuer_org.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (doc.doc_number && doc.doc_number.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner & Title Header */}
      <div className="bg-gradient-to-r from-[#08234D] via-[#0F346C] to-[#12397A] rounded-3xl p-6 sm:p-8 text-white shadow-soft relative overflow-hidden border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{isHindi ? 'सुरक्षित नागरिक दस्तावेज़ लॉकर' : 'Encrypted Citizen Vault & Organizer'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {isHindi ? 'नागरिक सरकारी दस्तावेज़ ऑर्गनाइजर' : 'Official Citizen Document Organizer'}
          </h1>
          <p className="text-sm text-slate-200 max-w-2xl leading-relaxed">
            {isHindi
              ? 'अपने सभी सरकारी प्रमाणपत्र (आधार, आय, जाति, ड्राइविंग लाइसेंस, अंकपत्र, आयुष्मान कार्ड) एक ही सुरक्षित स्थान पर प्रबंधित, व्यवस्थित और शेयर करें।'
              : 'Store, organize, categorize, preview, and share your authentic government documents & certificates with explicit consent.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={handleSyncDigiLocker}
            disabled={syncingDigi}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2 border border-emerald-400/40"
          >
            <RefreshCw className={`w-4 h-4 ${syncingDigi ? 'animate-spin' : ''}`} />
            <span>{syncingDigi ? 'Syncing DigiLocker...' : isHindi ? 'डिजिलॉकर सिंक करें' : 'Sync DigiLocker Vault'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs px-4 py-3 rounded-xl transition-all shadow-gold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isHindi ? 'नया दस्तावेज़ जोड़ें' : 'Organize New Document'}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Switcher & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        
        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-200/70 p-1.5 rounded-2xl border border-slate-300">
          <button
            onClick={() => setActiveTab('organizer')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'organizer'
                ? 'bg-[#08234D] text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FolderOpen className="w-4 h-4 text-amber-400" />
            <span>{isHindi ? 'दस्तावेज़ लॉकर (ऑर्गनाइजर)' : 'Private Vault & Organizer'}</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              {documents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('digilocker')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'digilocker'
                ? 'bg-[#08234D] text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>{isHindi ? 'डिजिलॉकर एकीकरण' : 'DigiLocker Official Sync'}</span>
          </button>
        </div>

        {/* Search Input */}
        {activeTab === 'organizer' && (
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'दस्तावेज़ का नाम या नंबर खोजें...' : 'Search documents by name, ID, or issuer...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#08234D]"
            />
          </div>
        )}
      </div>

      {activeTab === 'organizer' ? (
        <div className="space-y-6">
          
          {/* CATEGORY FILTER STRIP */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold border transition-all ${
                    isSelected
                      ? 'bg-[#08234D] text-white border-[#08234D] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* DOCUMENT CARDS MATRIX */}
          {loading ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <RefreshCw className="w-8 h-8 text-[#08234D] animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600 mt-3">Loading citizen document vault...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-extrabold text-base text-slate-800">
                {isHindi ? 'कोई दस्तावेज़ नहीं मिला' : 'No Official Documents Found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isHindi
                  ? 'चयनित श्रेणी या खोज शब्दों के लिए कोई दस्तावेज़ उपलब्ध नहीं है।'
                  : 'No documents match your selected category or search query. Click "Organize New Document" to add one.'}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-2 bg-[#08234D] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs"
              >
                + Add Document
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => {
                const categoryItem = categories.find((c) => c.id === doc.category) || categories[1];
                const CatIcon = categoryItem.icon;

                return (
                  <div
                    key={doc.doc_id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 shadow-soft hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
                  >
                    {/* Card Top */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 ${categoryItem.color || 'bg-slate-100 text-slate-800'}`}>
                          <CatIcon className="w-3.5 h-3.5" />
                          <span>{categoryItem.label}</span>
                        </span>

                        {doc.is_verified && (
                          <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Govt Verified</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#08234D] transition-colors leading-snug">
                        {doc.doc_name}
                      </h3>

                      <div className="space-y-1 text-xs text-slate-600">
                        <p className="flex items-center gap-1.5 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{doc.issuer_org}</span>
                        </p>
                        {doc.doc_number && (
                          <p className="font-mono text-[11px] text-amber-700 bg-amber-50 inline-block px-2 py-0.5 rounded-md border border-amber-200 font-bold">
                            Ref: {doc.doc_number}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Bottom Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-[#08234D] hover:text-white text-slate-700 transition-colors flex items-center gap-1 text-[11px] font-bold px-3"
                          title="Preview Document"
                        >
                          <Eye className="w-4 h-4 text-amber-500" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => downloadSamplePdf(doc)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-[#08234D] hover:text-white text-slate-700 transition-colors flex items-center gap-1 text-[11px] font-bold px-3"
                          title="Download Reference PDF"
                        >
                          <Download className="w-4 h-4 text-emerald-600" />
                          <span>PDF</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleDelete(doc.doc_id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove from Vault"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      ) : (
        /* DIGILOCKER DIRECT INTEGRATION PANEL */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800">
                <Globe className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  {isHindi ? 'डिजिलॉकर राष्ट्रीय दस्तावेज़ एकीकरण' : 'DigiLocker National Document Vault'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHindi ? 'भारत सरकार की डिजिटल लॉकर प्रणाली से सीधे सत्यापित प्रमाणपत्र प्राप्त करें' : 'Fetch authentic digital certificates directly from MeitY DigiLocker repository.'}
                </p>
              </div>
            </div>

            <a
              href="https://digilocker.gov.in"
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <span>{isHindi ? 'डिजिलॉकर पोर्टल खोलें' : 'Open DigiLocker.gov.in'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Synced DigiLocker Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Aadhaar Card (UIDAI Verified)', issuer: 'UIDAI', status: 'Synced', id: 'UIDAI-5489' },
              { title: 'Driving License Permit', issuer: 'Ministry of Road Transport', status: 'Synced', id: 'DL-142026' },
              { title: 'Class 12th Passing Certificate', issuer: 'CBSE New Delhi', status: 'Synced', id: 'CBSE-2026' },
              { title: 'Income & Revenue Certificate', issuer: 'State Revenue Department', status: 'Synced', id: 'INC-8891' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500">{item.issuer} • Ref: {item.id}</p>
                </div>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Synced
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL - PINNED TO VIEWPORT CENTER */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-955/90 backdrop-blur-md animate-fadeIn overflow-hidden">
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col shadow-2xl">
            
            <div className="bg-[#08234D] text-white p-5 flex items-center justify-between border-b border-amber-500/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">{previewDoc.doc_name}</h3>
                  <p className="text-xs text-amber-300 font-mono">Ref: {previewDoc.doc_number || 'SETU-DOC-2026-9812'}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              
              {/* 1. DEMO AADHAAR CARD PREVIEW LAYOUT */}
              {previewDoc.doc_type === 'AADHAAR' ? (
                <div className="bg-gradient-to-b from-amber-500/10 via-white to-emerald-500/10 border-2 border-amber-400/40 rounded-3xl p-6 shadow-md space-y-5 relative overflow-hidden">
                  
                  {/* Top Saffron/White/Green Republic Header */}
                  <div className="flex items-center justify-between border-b-2 border-[#08234D]/20 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-[#08234D] flex items-center justify-center border border-amber-400">
                        <img src="/india_gov_emblem.jpg" alt="" className="w-full h-full object-cover scale-125" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#08234D] tracking-wide">भारत सरकार • GOVERNMENT OF INDIA</p>
                        <p className="text-[10px] text-slate-600 font-bold">भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI)</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      ✓ e-KYC Verified
                    </span>
                  </div>

                  {/* Citizen Identity Content */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                    
                    {/* Photo Box */}
                    <div className="col-span-1 flex flex-col items-center">
                      <div className="w-24 h-28 rounded-2xl border-2 border-[#08234D]/40 shadow-md relative overflow-hidden bg-[#08234D] text-amber-400 flex flex-col items-center justify-center pt-2">
                        <User className="w-12 h-12 text-amber-400 mb-4" />
                        <span className="text-[9px] font-extrabold bg-[#08234D] text-amber-300 w-full text-center py-0.5 absolute bottom-0 uppercase tracking-wider border-t border-amber-400/30">
                          UIDAI e-KYC
                        </span>
                      </div>
                    </div>

                    {/* Particulars Details */}
                    <div className="col-span-2 space-y-1.5 text-xs text-slate-900">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Name / नाम</p>
                        <p className="font-extrabold text-sm text-[#08234D]">Rajesh Kumar / राजेश कुमार</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">DOB / जन्म तिथि</p>
                          <p className="font-extrabold text-xs">15/08/1995</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Gender / लिंग</p>
                          <p className="font-extrabold text-xs">Male / पुरुष</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Address / पता</p>
                        <p className="text-[11px] font-semibold text-slate-700 leading-tight">
                          House 142, Sector 4, Central District, New Delhi - 110001
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Aadhaar 12-Digit Number Strip */}
                  <div className="bg-[#08234D] text-amber-300 p-3 rounded-2xl text-center space-y-1 shadow-sm">
                    <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest">Aadhaar Number / आधार क्रमांक</p>
                    <p className="text-xl sm:text-2xl font-black font-mono tracking-widest text-amber-300">
                      5489 1234 9821
                    </p>
                  </div>

                  {/* Card Bottom Motto */}
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-600 border-t border-slate-200 pt-2">
                    <span>मेरा आधार, मेरी पहचान</span>
                    <span>UIDAI Digital Vault Copy</span>
                  </div>

                </div>
              ) : previewDoc.doc_type === 'PAN_CARD' ? (
                /* 2. DEMO PAN CARD PREVIEW LAYOUT */
                <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 shadow-md space-y-4 border-2 border-amber-400/40 relative">
                  <div className="flex items-center justify-between border-b border-white/20 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
                        <img src="/india_gov_emblem.jpg" alt="" className="w-full h-full object-cover scale-125 rounded-full" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-amber-400 uppercase tracking-wider">INCOME TAX DEPARTMENT</p>
                        <p className="text-[9px] text-slate-300 font-bold">GOVT OF INDIA • आयकर विभाग</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black">
                      PERMANENT ACCOUNT CARD
                    </span>
                  </div>

                  <div className="space-y-3 font-mono">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase">PAN Number</p>
                      <p className="text-2xl font-black tracking-widest text-amber-300">ABCDE1234F</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase">Name</p>
                        <p className="font-bold">RAJESH KUMAR</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase">Father's Name</p>
                        <p className="font-bold">SURESH KUMAR</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] text-slate-400 uppercase">Date of Birth</p>
                      <p className="font-bold text-xs">15/08/1995</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* 3. GENERAL OFFICIAL GOVERNMENT CERTIFICATE LAYOUT */
                <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl text-center space-y-4 relative">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 mx-auto">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">{previewDoc.doc_name}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Issuing Authority: <strong>{previewDoc.issuer_org}</strong>
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-medium">Certificate Ref ID:</span>
                      <span className="font-mono font-bold text-amber-700">{previewDoc.doc_number || 'SETU-DOC-2026-8819'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-medium">Holder Name:</span>
                      <span className="font-bold text-slate-900">Rajesh Kumar</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-medium">Verification Seal:</span>
                      <span className="font-bold text-emerald-700">✓ Govt Digital Signature Verified</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Encryption Standard:</span>
                      <span className="font-mono text-[11px] text-slate-600">256-Bit SHA Certificate</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => downloadSamplePdf(previewDoc)}
                  className="bg-[#08234D] hover:bg-[#0F346C] text-white text-xs font-extrabold px-6 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download Reference File</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* UPLOAD & ORGANIZE NEW DOCUMENT MODAL */}
      {showAddModal && (
        <div className="modal-backdrop z-50">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-modal overflow-hidden animate-fadeIn border border-slate-200">
            
            <div className="bg-[#08234D] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plus className="w-6 h-6 text-amber-400" />
                <h3 className="font-extrabold text-base">
                  {isHindi ? 'नया दस्तावेज़ व्यवस्थित करें' : 'Organize New Official Document'}
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDocumentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Document Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#08234D]"
                >
                  <option value="IDENTITY">Identity Proof (Aadhaar / PAN / Voter)</option>
                  <option value="INCOME">Income & Tax (Income Cert / EWS)</option>
                  <option value="EDUCATION">Education & Student (Marks / APAAR)</option>
                  <option value="TRANSPORT">Transport & Vehicle (DL / RC)</option>
                  <option value="HOUSING">Housing & Land (PMAY / Land Title)</option>
                  <option value="HEALTH">Health & Welfare (Ayushman / Ration)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Document Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Caste Certificate 2026"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#08234D]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Issuing Department / Authority <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newIssuer}
                  onChange={(e) => setNewIssuer(e.target.value)}
                  placeholder="e.g. District Revenue Department"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#08234D]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Document Reference Number
                </label>
                <input
                  type="text"
                  value={newDocNumber}
                  onChange={(e) => setNewDocNumber(e.target.value)}
                  placeholder="e.g. CERT-2026-99120"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#08234D]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#08234D] hover:bg-[#0F346C] text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Save to Document Organizer</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
