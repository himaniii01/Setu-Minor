import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Check, ArrowRight, ArrowLeft, ShieldCheck, FileText, UserCheck, 
  Sparkles, Award, ExternalLink, Zap, Home as HomeIcon, HeartPulse, 
  GraduationCap, Sprout, Hammer, FileCheck, PartyPopper, Heart, Briefcase, Droplets, CreditCard,
  Plus, Upload, FilePlus, X, CheckCircle2, Eye
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GovernmentService, DocumentItem } from '../types';
import { ConsentModal } from '../components/ConsentModal';
import { ConfettiPopper } from '../components/ConfettiPopper';

// Fallback STATIC CATALOG for 100% accurate service matching across all routes
const STATIC_SERVICES_CATALOG: GovernmentService[] = [
  {
    service_id: 'svc-001',
    code: 'MP-SCH-001',
    name: 'Mukhyamantri Ladli Behna Yojana (Women Financial Aid)',
    provider: 'Department of Women & Child Development',
    category: 'Social Welfare & Financial Assistance',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'State Livelihoods Mission',
    required_documents: 'AADHAAR, RATION_CARD, BANK_PASSBOOK, RESIDENCE_PROOF',
    description: 'Direct monthly financial assistance of Rs 1,250 directly transferred to eligible married, widowed, and destitute women for financial independence.'
  },
  {
    service_id: 'svc-003',
    code: 'MP-SCH-003',
    name: 'Mukhyamantri Seekho-Kamao Yojana (Skill & Stipend)',
    provider: 'Department of Technical Education & Skill Development',
    category: 'Education & Scholarships',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'Skill Development Corporation',
    required_documents: 'AADHAAR, MARKS_MEMO, DEGREE_CERTIFICATE, BANK_PASSBOOK',
    description: 'Skill enhancement program providing hands-on industry training along with a monthly direct stipend of Rs 8,000 to Rs 10,000 for youth.'
  },
  {
    service_id: 'svc-007',
    code: 'MP-SCH-007',
    name: 'Mukhyamantri Udyam Kranti Yojana (MSME Enterprise Loan)',
    provider: 'Department of Micro, Small & Medium Enterprises',
    category: 'Employment & MSME Support',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'MSME Development Cell',
    required_documents: 'AADHAAR, PAN_CARD, INCOME_CERTIFICATE',
    description: 'Bank collateral-free self-employment loans up to Rs 50 Lakh for youth with 3% interest subsidy and full 7-year guarantee fee reimbursement.'
  },
  {
    service_id: 'svc-021',
    code: 'MP-SCH-021',
    name: 'Jal Jeevan Mission Household Tap Connection (FHTC)',
    provider: 'Public Health Engineering Department',
    category: 'Municipal & Civic Amenities',
    integration_type: 'PUBLIC_OPEN_DATA',
    state: 'Rural Water Supply Mission',
    required_documents: 'AADHAAR, RESIDENCE_PROOF',
    description: 'Provides guaranteed safe drinking water tap connection to every rural household with quality testing and maintenance.'
  },
  {
    service_id: 'svc-024',
    code: 'MP-SCH-024',
    name: 'Kisan Credit Card & Irrigation Equipment Subsidy',
    provider: 'Department of Agriculture & Farmers Welfare',
    category: 'Agriculture & Farmers Welfare',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'Agriculture Department',
    required_documents: 'AADHAAR, LAND_TITLE, BANK_PASSBOOK',
    description: 'Subsidized micro-irrigation systems (drip/sprinkler) and low-interest crop credit up to Rs 3 Lakh via Kisan Credit Card for small and marginal farmers.'
  },
  {
    service_id: 'svc-052',
    code: 'MP-SCH-052',
    name: 'Social Security Old Age, Widow & Disability Pension',
    provider: 'Department of Social Justice & Disabled Welfare',
    category: 'Social Welfare & Pension',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'Social Security Mission',
    required_documents: 'AADHAAR, AGE_PROOF, INCOME_CERTIFICATE',
    description: 'Direct monthly pension transfers to senior citizens aged 60+, destitute widows, and persons with 40%+ benchmark disability.'
  },
  {
    service_id: 'svc-008',
    code: 'MP-SCH-008',
    name: 'Mukhyamantri Kanya Vivah & Nikah Financial Assistance',
    provider: 'Department of Social Justice',
    category: 'Social Welfare & Financial Assistance',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'Social Justice Department',
    required_documents: 'AADHAAR, INCOME_CERTIFICATE, RATION_CARD',
    description: 'Financial assistance of Rs 51,000 per eligible bride from needy families for marriage arrangements and household setup.'
  },
  {
    service_id: 'svc-solar',
    code: 'PM-SOLAR-2026',
    name: 'PM Surya Ghar: Muft Bijli Yojana (2026 Solar Subsidy)',
    provider: 'Ministry of New and Renewable Energy',
    category: 'Municipal & Civic Amenities',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'All India Union & States',
    required_documents: 'AADHAAR, ELECTRICITY_BILL, RESIDENCE_PROOF',
    description: 'Provides free electricity up to 300 units per month for households with a central capital subsidy of up to Rs. 78,000 for rooftop solar installation.'
  },
  {
    service_id: 'svc-sch-post',
    code: 'SCH-POST-01',
    name: 'Post-Matric Tuition Fee Reimbursement',
    provider: 'Department of Higher Education',
    category: 'Education & Scholarships',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'Central & State Neutral',
    required_documents: 'AADHAAR, INCOME_CERTIFICATE, MARKS_MEMO',
    description: '100% full tuition fee waiver and annual maintenance allowance for eligible college students meeting statutory income and attendance criteria.'
  },
  {
    service_id: 'svc-inc-cert',
    code: 'INC-CERT-01',
    name: 'Issuance of Income Certificate',
    provider: 'e-District Revenue Department',
    category: 'Citizen Certificates',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'State Revenue Department',
    required_documents: 'AADHAAR, RATION_CARD, PAN_CARD',
    description: 'Official Tahsildar verified annual family income certificate required for educational, scholarship and statutory fee concessions.'
  },
  {
    service_id: 'svc-lakhpati',
    code: 'LAKHPATI-DIDI-2026',
    name: 'Lakhpati Didi SHG Women Empowerment Scheme (2026)',
    provider: 'Ministry of Rural Development',
    category: 'Education & Scholarships',
    integration_type: 'PARTNER_ONLY',
    state: 'National Rural Livelihoods',
    required_documents: 'AADHAAR, BANK_PASSBOOK, SHG_MEMBERSHIP_ID',
    description: 'Skill training, micro-credit access, and market linkage for women members of Self-Help Groups (SHGs) targeting Rs. 1 Lakh annual sustainable income.'
  },
  {
    service_id: 'svc-ayush-senior',
    code: 'AYUSH-SENIOR-70',
    name: 'Ayushman Vaya Vandana Card (Senior Citizen 70+)',
    provider: 'National Health Authority (NHA)',
    category: 'Health & Medical Welfare',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'All India Central',
    required_documents: 'AADHAAR, AGE_PROOF, RATION_CARD',
    description: 'Free cashless health insurance coverage up to Rs. 5 Lakh per year for all senior citizens aged 70 and above, regardless of family income.'
  },
  {
    service_id: 'svc-viksit-yuva',
    code: 'VIKSIT-YUVA-2026',
    name: 'Viksit Bharat Yuva Apprenticeship & Internship Scheme',
    provider: 'Ministry of Skill Development & Entrepreneurship',
    category: 'Education & Scholarships',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'All India Union',
    required_documents: 'AADHAAR, MARKS_MEMO, RESIDENCE_PROOF',
    description: 'Monthly direct stipend of Rs. 5,000 for 12 months plus one-time assistance of Rs. 6,000 for youth placed in top Indian corporate enterprises.'
  },
  {
    service_id: 'svc-apaar-id',
    code: 'APAAR-ID-2026',
    name: 'ONE Nation ONE Student ID (APAAR ID Portal)',
    provider: 'Ministry of Education & Academic Bank of Credits',
    category: 'Education & Scholarships',
    integration_type: 'PUBLIC_OPEN_DATA',
    state: 'All India National',
    required_documents: 'AADHAAR, MARKS_MEMO, STUDENT_ID',
    description: 'Permanent 12-digit academic ID tracking student learning credits, certificates, degrees, and co-curricular achievements digitally.'
  },
  {
    service_id: 'svc-agristack',
    code: 'AGR-AGRISTACK',
    name: 'Digital Agriculture Mission & Agristack Farmer ID',
    provider: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Agriculture & Farmers Welfare',
    integration_type: 'PUBLIC_OPEN_DATA',
    state: 'Central & State Agriculture',
    required_documents: 'AADHAAR, LAND_TITLE, BANK_PASSBOOK',
    description: 'Digital farmer registry providing instant access to crop insurance, soil health cards, customized advisory, and PM-KISAN direct benefit transfers.'
  },
  {
    service_id: 'svc-vishwakarma',
    code: 'VISHWAKARMA-2026',
    name: 'PM Vishwakarma Artisan Support Scheme',
    provider: 'Ministry of Micro, Small & Medium Enterprises',
    category: 'Agriculture & Farmers Welfare',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'All India Union',
    required_documents: 'AADHAAR, BANK_PASSBOOK, ARTISAN_DECLARATION',
    description: 'Collateral-free credit support up to Rs. 3 Lakh at 5% interest, Rs. 15,000 toolkit incentive, and free skill enhancement for traditional artisans.'
  }
];

export const ApplyStepper: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [service, setService] = useState<GovernmentService | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);

  // Form State Pre-filled from Consented Citizen Profile
  const [fullName, setFullName] = useState<string>('');
  const [dob, setDob] = useState<string>('1995-08-15');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('rajesh123@gmail.com');
  const [category, setCategory] = useState<string>('BC');
  const [annualIncome, setAnnualIncome] = useState<string>('140000');
  
  // Scheme-Specific Particulars State
  // 1. Ladli Behna (Women Aid)
  const [bankAccountNo, setBankAccountNo] = useState<string>('918820192811');
  const [bankIfsc, setBankIfsc] = useState<string>('SBIN0001420');
  const [maritalStatus, setMaritalStatus] = useState<string>('Married');

  // 2. Seekho-Kamao (Youth Skill & Stipend)
  const [highestQual, setHighestQual] = useState<string>('B.Tech / Bachelor Degree');
  const [skillTrade, setSkillTrade] = useState<string>('Information Technology & Software');
  const [academicGrade, setAcademicGrade] = useState<string>('85.5%');

  // 3. Udyam Kranti (MSME Enterprise Loan)
  const [enterpriseName, setEnterpriseName] = useState<string>('Rajesh Tech & Solar Services');
  const [requestedLoanAmount, setRequestedLoanAmount] = useState<string>('1500000');
  const [businessCategory, setBusinessCategory] = useState<string>('Services Sector');

  // 4. Jal Jeevan (Tap Connection)
  const [gramPanchayat, setGramPanchayat] = useState<string>('Central Sector Ward 4');
  const [wardNo, setWardNo] = useState<string>('Ward No. 12');

  // 5. Kisan Credit Card & Agriculture
  const [landArea, setLandArea] = useState<string>('3.5');
  const [khasraNo, setKhasraNo] = useState<string>('KH-892/2026');
  const [irrigationType, setIrrigationType] = useState<string>('Drip Irrigation & Solar Pump');
  const [kccCreditAmount, setKccCreditAmount] = useState<string>('200000');

  // 6. Social Security Pension
  const [pensionCategory, setPensionCategory] = useState<string>('Senior Citizen Old Age (60+)');
  const [disabilityCertNo, setDisabilityCertNo] = useState<string>('DIS-2026-9812');

  // 7. Kanya Vivah
  const [brideAge, setBrideAge] = useState<string>('22');
  const [groomName, setGroomName] = useState<string>('Vikram Singh');
  const [marriageDate, setMarriageDate] = useState<string>('2026-11-20');

  // 8. Solar / Electricity
  const [rooftopArea, setRooftopArea] = useState<string>('550');
  const [monthlyUnits, setMonthlyUnits] = useState<string>('240');
  const [consumerNo, setConsumerNo] = useState<string>('DISCOM-DEL-984712');
  const [solarCapacity, setSolarCapacity] = useState<string>('3 kW');

  // 9. Certificates & General
  const [certificatePurpose, setCertificatePurpose] = useState<string>('Higher Education Admission & Statutory Fee Waiver');
  const [fatherHusbandName, setFatherHusbandName] = useState<string>('Suresh Kumar');

  // Step 3 Selected Docs
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  // Step 3 Add Document Modal State
  const [showAddDocModal, setShowAddDocModal] = useState<boolean>(false);
  const [customDocType, setCustomDocType] = useState<string>('DOMICILE_CERTIFICATE');
  const [customDocName, setCustomDocName] = useState<string>('');
  const [customDocRef, setCustomDocRef] = useState<string>('');

  // Step 3 Document View Preview State
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Submission Success & Celebration Confetti
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedAppRef, setSubmittedAppRef] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const handleAddCustomDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    const docTypeClean = (customDocType || 'OTHER_DOCUMENT').toUpperCase();
    const newDocId = `doc-custom-${Date.now()}`;
    const newStorageUri = `vault://documents/${docTypeClean.toLowerCase()}_${customDocRef || 'verified'}.pdf`;

    const newDoc: DocumentItem = {
      document_id: newDocId,
      user_id: user?.user_id || 'u-1',
      type: customDocName ? `${docTypeClean} (${customDocName})` : docTypeClean,
      storage_uri: newStorageUri,
      checksum: `sha256_${Date.now()}`,
      verification_status: 'VERIFIED',
      created_at: new Date().toISOString()
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocs((prev) => [...prev, newDocId]);
    setShowAddDocModal(false);
    setCustomDocName('');
    setCustomDocRef('');
    showToast('New document successfully verified and linked from vault!', 'success');
  };

  useEffect(() => {
    fetchServiceAndProfile();
  }, [code, user]);

  const fetchServiceAndProfile = async () => {
    try {
      const searchCode = (code || '').toUpperCase();
      let target: GovernmentService | undefined;

      try {
        const resSvc = await api.get('/services');
        if (resSvc.data.services) {
          target = resSvc.data.services.find(
            (s: GovernmentService) =>
              s.code.toUpperCase() === searchCode || s.service_id.toUpperCase() === searchCode
          );
        }
      } catch (e) {
        console.warn('API services fetch error, using catalog fallback');
      }

      if (!target) {
        target = STATIC_SERVICES_CATALOG.find(
          (s) => s.code.toUpperCase() === searchCode || s.service_id.toUpperCase() === searchCode
        );
      }
      if (!target) {
        target = STATIC_SERVICES_CATALOG[0];
      }
      setService(target);

      if (user) {
        setFullName(user.profile?.full_name || 'Rajesh Kumar');
        setDob(user.profile?.dob || '1995-08-15');
        setMobileNumber(user.mobile_number || '9876543210');
        setEmail(user.email || 'rajesh123@gmail.com');
        setCategory(user.profile?.category || 'BC');
        setAnnualIncome(String(user.profile?.annual_income || 140000));

        let userDocs: DocumentItem[] = [];
        try {
          const resDocs = await api.get('/documents');
          userDocs = resDocs.data.documents || [];
        } catch (e) {
          console.warn('API documents fetch error');
        }

        const hasAadhaar = userDocs.some((d: DocumentItem) => d.type.toUpperCase().includes('AADHAAR'));
        if (!hasAadhaar) {
          userDocs = [
            {
              document_id: 'doc-aadhaar-auto',
              user_id: user.user_id,
              type: 'AADHAAR_CARD',
              storage_uri: 'vault://documents/aadhaar_smart_card_9918.pdf',
              checksum: 'aadhaar991820268821sha256verified',
              verification_status: 'VERIFIED',
              created_at: new Date().toISOString()
            },
            ...userDocs
          ];
        }

        setDocuments(userDocs);
        if (userDocs.length > 0) {
          setSelectedDocs(userDocs.map((d: DocumentItem) => d.document_id));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayDocuments = (): DocumentItem[] => {
    const defaultPool: DocumentItem[] = [
      {
        document_id: 'doc-aadhaar-vault',
        user_id: user?.user_id || 'u-1',
        type: 'AADHAAR_CARD',
        storage_uri: 'vault://documents/aadhaar_smart_card_9918.pdf',
        checksum: 'aadhaar991820268821sha256verified',
        verification_status: 'VERIFIED',
        created_at: '2026-01-10T00:00:00.000Z'
      },
      {
        document_id: 'doc-income-vault',
        user_id: user?.user_id || 'u-1',
        type: 'INCOME_CERTIFICATE',
        storage_uri: 'vault://documents/income_cert_2026.pdf',
        checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        verification_status: 'VERIFIED',
        created_at: '2026-02-14T00:00:00.000Z'
      },
      {
        document_id: 'doc-ration-vault',
        user_id: user?.user_id || 'u-1',
        type: 'RATION_CARD',
        storage_uri: 'vault://documents/ration_card_family.pdf',
        checksum: '991b7852b855e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495',
        verification_status: 'VERIFIED',
        created_at: '2026-02-14T00:00:00.000Z'
      },
      {
        document_id: 'doc-residence-vault',
        user_id: user?.user_id || 'u-1',
        type: 'RESIDENCE_PROOF',
        storage_uri: 'vault://documents/domicile_native_cert_2026.pdf',
        checksum: 'domicile2026nativecertsha256',
        verification_status: 'VERIFIED',
        created_at: '2026-05-15T00:00:00.000Z'
      },
      {
        document_id: 'doc-bank-vault',
        user_id: user?.user_id || 'u-1',
        type: 'BANK_PASSBOOK',
        storage_uri: 'vault://documents/sbi_bank_passbook_9188.pdf',
        checksum: 'sbibankpassbook918820192811',
        verification_status: 'VERIFIED',
        created_at: '2026-06-01T00:00:00.000Z'
      },
      {
        document_id: 'doc-marks-vault',
        user_id: user?.user_id || 'u-1',
        type: 'MARKS_MEMO',
        storage_uri: 'vault://documents/marksheet_degree.pdf',
        checksum: 'f4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149afb',
        verification_status: 'VERIFIED',
        created_at: '2026-03-01T00:00:00.000Z'
      },
      {
        document_id: 'doc-electricity-vault',
        user_id: user?.user_id || 'u-1',
        type: 'ELECTRICITY_BILL',
        storage_uri: 'vault://documents/discom_electricity_bill_2026.pdf',
        checksum: 'discom984712bill2026sha256',
        verification_status: 'VERIFIED',
        created_at: '2026-04-10T00:00:00.000Z'
      },
      {
        document_id: 'doc-pan-vault',
        user_id: user?.user_id || 'u-1',
        type: 'PAN_CARD',
        storage_uri: 'vault://documents/pan_card_abcpk9847l.pdf',
        checksum: 'panabcpk9847l2026sha256verified',
        verification_status: 'VERIFIED',
        created_at: '2026-01-11T00:00:00.000Z'
      },
      {
        document_id: 'doc-land-vault',
        user_id: user?.user_id || 'u-1',
        type: 'LAND_TITLE',
        storage_uri: 'vault://documents/khasra_land_record_892.pdf',
        checksum: 'khasralandrecord8922026sha256',
        verification_status: 'VERIFIED',
        created_at: '2026-07-01T00:00:00.000Z'
      }
    ];

    const allPool = [...documents];
    defaultPool.forEach(d => {
      if (!allPool.some(x => x.type.toUpperCase() === d.type.toUpperCase())) {
        allPool.push(d);
      }
    });

    if (!service) return allPool;

    const reqStr = (service.required_documents || '').toUpperCase();
    const reqTokens = reqStr.split(',').map(s => s.trim()).filter(Boolean);

    // Always include Aadhaar Card first
    const aadhaarDoc = allPool.find(d => d.type.toUpperCase().includes('AADHAAR')) || defaultPool[0];
    
    // Filter documents matching scheme required tokens
    const schemeSpecificDocs = allPool.filter(doc => {
      const t = doc.type.toUpperCase();
      if (t.includes('AADHAAR')) return false;
      return reqTokens.some(tok => t.includes(tok) || tok.includes(t));
    });

    const finalDocs = [aadhaarDoc, ...schemeSpecificDocs];

    // If less than 3 docs, add Income Certificate or Bank Passbook if not present
    if (finalDocs.length < 3) {
      allPool.forEach(d => {
        if (!finalDocs.some(x => x.type === d.type) && finalDocs.length < 4) {
          finalDocs.push(d);
        }
      });
    }

    return finalDocs;
  };

  const getSchemeType = (svc: GovernmentService | null) => {
    if (!svc) return 'GENERAL';
    const c = (svc.code || '').toUpperCase();
    const cat = (svc.category || '').toUpperCase();
    const n = (svc.name || '').toUpperCase();

    if (c === 'MP-SCH-001' || n.includes('LADLI BEHNA')) return 'LADLI_BEHNA';
    if (c === 'MP-SCH-003' || n.includes('SEEKHO')) return 'SEEKHO_KAMAO';
    if (c === 'MP-SCH-007' || n.includes('UDYAM')) return 'UDYAM_KRANTI';
    if (c === 'MP-SCH-021' || n.includes('JAL JEEVAN')) return 'JAL_JEEVAN';
    if (c === 'MP-SCH-024' || (c.includes('AGR') && n.includes('CREDIT'))) return 'KISAN_CREDIT';
    if (c === 'MP-SCH-052' || n.includes('PENSION')) return 'SOCIAL_PENSION';
    if (c === 'MP-SCH-008' || n.includes('KANYA VIVAH')) return 'KANYA_VIVAH';

    if (c.includes('SOLAR') || n.includes('SOLAR') || n.includes('BIJLI')) return 'SOLAR';
    if (c.includes('AGR') || cat.includes('AGRICULTURE') || n.includes('FARMER') || n.includes('AGRISTACK')) return 'AGRICULTURE';
    if (c.includes('AYUSH') || n.includes('SENIOR') || n.includes('HEALTH') || cat.includes('HEALTH')) return 'HEALTH_SENIOR';
    if (c.includes('HSG') || c.includes('PMAY') || cat.includes('HOUSING') || n.includes('AWAS')) return 'HOUSING';
    if (c.includes('VISHWAKARMA') || n.includes('VISHWAKARMA') || n.includes('ARTISAN')) return 'ARTISAN';
    if (c.includes('SCH-') || c.includes('EDU') || c.includes('APAAR') || c.includes('VIKSIT') || cat.includes('EDUCATION')) return 'EDUCATION';
    if (c.includes('CERT') || cat.includes('CERTIFICATE') || n.includes('CERTIFICATE')) return 'CERTIFICATE';
    return 'GENERAL';
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-[#E6ECF4] rounded-3xl shadow-soft text-center space-y-4">
        <UserCheck className="w-12 h-12 text-[#0B2A5B] mx-auto" />
        <h2 className="text-xl font-bold text-[#0F1F3D]">Authentication Required</h2>
        <p className="text-xs text-slate-500">Please sign in with your SETU Citizen account to apply for government services.</p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-[#0B2A5B] text-white py-2.5 rounded-xl font-bold text-sm"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (loading || !service) {
    return <div className="py-20 text-center text-slate-400 font-medium animate-pulse">Initializing Application Stepper & Vault Sync...</div>;
  }

  const schemeType = getSchemeType(service);

  const steps = [
    { num: 1, label: 'Personal Details' },
    { num: 2, label: `${service.category.split('&')[0]} Details` },
    { num: 3, label: 'Document Attachments' },
    { num: 4, label: 'Preview & Submit' }
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowConsentModal(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const idempotencyKey = `idem-${service.code.toLowerCase()}-${Date.now()}`;
      
      const resConsent = await api.post('/consents', {
        recipient_service_id: service.service_id,
        purpose: `Verification for ${service.name} application`,
        requested_fields: ['full_name', 'dob', 'annual_income', 'category'],
        expiry_days: 180
      });

      const consentId = resConsent.data.consent.consent_id;

      let customFormData: any = {
        applicantName: fullName,
        dob,
        mobileNumber,
        email,
        annualIncome,
        category,
        prototypeCitizenId: user.profile?.prototype_cit_id,
        schemeCategory: service.category,
        schemeName: service.name
      };

      if (schemeType === 'LADLI_BEHNA') {
        customFormData = { ...customFormData, bankAccountNo, bankIfsc, maritalStatus };
      } else if (schemeType === 'SEEKHO_KAMAO') {
        customFormData = { ...customFormData, highestQual, skillTrade, academicGrade, bankAccountNo };
      } else if (schemeType === 'UDYAM_KRANTI') {
        customFormData = { ...customFormData, enterpriseName, requestedLoanAmount, businessCategory };
      } else if (schemeType === 'JAL_JEEVAN') {
        customFormData = { ...customFormData, gramPanchayat, wardNo };
      } else if (schemeType === 'KISAN_CREDIT') {
        customFormData = { ...customFormData, landArea, khasraNo, irrigationType, kccCreditAmount };
      } else if (schemeType === 'SOCIAL_PENSION') {
        customFormData = { ...customFormData, pensionCategory, bankAccountNo, disabilityCertNo };
      } else if (schemeType === 'KANYA_VIVAH') {
        customFormData = { ...customFormData, brideAge, groomName, marriageDate, bankAccountNo };
      } else if (schemeType === 'SOLAR') {
        customFormData = { ...customFormData, rooftopArea, monthlyUnits, consumerNo, solarCapacity };
      } else if (schemeType === 'EDUCATION') {
        customFormData = { ...customFormData, highestQual, academicGrade };
      } else {
        customFormData = { ...customFormData, certificatePurpose, fatherHusbandName };
      }

      const resApp = await api.post('/applications', {
        service_id: service.service_id,
        consent_id: consentId,
        idempotency_key: idempotencyKey,
        form_data: customFormData
      });

      setShowConsentModal(false);
      const refNo = resApp.data.application.external_ref;
      setSubmittedAppRef(refNo);
      setIsSubmitted(true);
      setShowConfetti(true);

      showToast('Application Submitted!', `Reference ${refNo} generated successfully!`, 'success');
    } catch (err: any) {
      showToast('Submission Blocked', err.response?.data?.error?.message || 'Gateway error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS CELEBRATION VIEW WITH PARTY POPPER CONFETTI
  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-fadeIn relative">
        {showConfetti && <ConfettiPopper onComplete={() => setShowConfetti(false)} />}
        
        <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6 relative overflow-hidden">
          
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-3xl mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 transform hover:scale-105 transition-transform">
            <PartyPopper className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Scheme Application Submitted! 🎉
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F1F3D]">
              Congratulations, {fullName}!
            </h1>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Your application for <strong className="text-[#0B2A5B]">{service.name}</strong> has been encrypted and routed via SETU Interoperability Gateway.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto text-left space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>REFERENCE NUMBER</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">ACTIVE GATEWAY</span>
            </div>
            <div className="text-xl font-mono font-black text-[#0B2A5B] tracking-wide select-all">
              {submittedAppRef}
            </div>
            <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 grid grid-cols-2 gap-2">
              <div><strong>Provider:</strong> {service.provider}</div>
              <div><strong>Status:</strong> UNDER_REVIEW</div>
              <div><strong>Timestamp:</strong> {new Date().toLocaleDateString('en-IN')}</div>
              <div><strong>Verification:</strong> Automatic</div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/track?ref=${submittedAppRef}`)}
              className="w-full sm:w-auto px-6 py-3 bg-[#0B2A5B] hover:bg-[#12397A] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Track Application Status</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-[#0F1F3D] font-bold rounded-xl text-sm transition-all"
            >
              Return to Citizen Dashboard
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 4-Step Stepper Header */}
      <div className="bg-white border border-[#E6ECF4] rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between relative max-w-2xl mx-auto">
          {steps.map((st) => {
            const isCompleted = currentStep > st.num;
            const isActive = currentStep === st.num;
            return (
              <div key={st.num} className="flex flex-col items-center relative z-10 space-y-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isActive
                    ? 'bg-[#0B2A5B] text-white ring-4 ring-[#0B2A5B]/15 scale-110 shadow-md'
                    : 'border-2 border-slate-300 text-slate-400 bg-white'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : st.num}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${
                  isActive ? 'text-[#0B2A5B]' : 'text-slate-400'
                }`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-[#E6ECF4] rounded-3xl p-6 sm:p-10 shadow-soft">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E6ECF4] pb-4 mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Scheme Code: {service.code}</span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                {service.category}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#0F1F3D] mt-0.5">{service.name}</h2>
          </div>
          <span className="text-xs font-bold bg-blue-50 text-[#0B2A5B] px-3.5 py-1.5 rounded-full border border-blue-100 shrink-0 self-start sm:self-auto">
            Step {currentStep} of 4: {steps[currentStep - 1].label}
          </span>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          
          {/* STEP 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-[#0B2A5B] flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600" />
                <span>Autofilled from verified citizen profile (Prototype ID: <strong className="font-mono">{user.profile?.prototype_cit_id}</strong>)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm text-[#0F1F3D] bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                    Date of Birth <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm text-[#0F1F3D] bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm text-[#0F1F3D] bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm text-[#0F1F3D] bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                    Social Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm text-[#0F1F3D] bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
                  >
                    <option value="General">General Category</option>
                    <option value="BC">Backward Class (BC/OBC)</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="EWS">Economically Weaker Section (EWS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                    Annual Family Income (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm text-[#0F1F3D] focus:outline-none focus:ring-2 focus:ring-[#0B2A5B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Scheme Dynamic Particulars */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-3.5 bg-[#0B2A5B]/5 border border-[#0B2A5B]/15 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0B2A5B] text-white flex items-center justify-center shrink-0">
                  {schemeType === 'LADLI_BEHNA' && <Heart className="w-5 h-5 text-rose-300" />}
                  {schemeType === 'SEEKHO_KAMAO' && <GraduationCap className="w-5 h-5 text-indigo-300" />}
                  {schemeType === 'UDYAM_KRANTI' && <Briefcase className="w-5 h-5 text-amber-300" />}
                  {schemeType === 'JAL_JEEVAN' && <Droplets className="w-5 h-5 text-sky-300" />}
                  {schemeType === 'KISAN_CREDIT' && <Sprout className="w-5 h-5 text-emerald-300" />}
                  {schemeType === 'SOCIAL_PENSION' && <HeartPulse className="w-5 h-5 text-purple-300" />}
                  {schemeType === 'KANYA_VIVAH' && <Sparkles className="w-5 h-5 text-pink-300" />}
                  {schemeType === 'SOLAR' && <Zap className="w-5 h-5 text-amber-300" />}
                  {schemeType === 'GENERAL' && <FileCheck className="w-5 h-5 text-blue-300" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F1F3D]">Scheme Specific Particulars</h4>
                  <p className="text-[11px] text-slate-500">Customized fields for <strong className="text-[#0B2A5B]">{service.name}</strong></p>
                </div>
              </div>

              {/* 1. MUKHYAMANTRI LADLI BEHNA YOJANA */}
              {schemeType === 'LADLI_BEHNA' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      DBT Linked Bank Account Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankAccountNo}
                      onChange={(e) => setBankAccountNo(e.target.value)}
                      required
                      placeholder="e.g. 918820192811"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Bank IFSC Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value)}
                      required
                      placeholder="e.g. SBIN0001420"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Marital Status <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none bg-white"
                    >
                      <option value="Married">Married (विवाहित)</option>
                      <option value="Widowed">Widowed (परित्यक्ता/विधवा)</option>
                      <option value="Destitute">Destitute / Unmarried (कल्याणी)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 2. SEEKHO KAMAO YOJANA */}
              {schemeType === 'SEEKHO_KAMAO' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Highest Qualification <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={highestQual}
                      onChange={(e) => setHighestQual(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none bg-white"
                    >
                      <option value="12th Pass">Class 12th Senior Secondary (₹8,000/mo Stipend)</option>
                      <option value="ITI Pass">ITI Certificate Pass (₹8,500/mo Stipend)</option>
                      <option value="Diploma Pass">Polytechnic Diploma Pass (₹9,000/mo Stipend)</option>
                      <option value="Graduate/Post-Graduate">Degree / Post-Graduate (₹10,000/mo Stipend)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Preferred Industry Training Sector <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={skillTrade}
                      onChange={(e) => setSkillTrade(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none bg-white"
                    >
                      <option value="Information Technology & Software">Information Technology & Software</option>
                      <option value="Electronics & Hardware Assembly">Electronics & Hardware Assembly</option>
                      <option value="Automotive & Mechanical">Automotive & Mechanical Engineering</option>
                      <option value="Banking & Financial Services">Banking & Financial Services</option>
                      <option value="Healthcare & Allied Services">Healthcare & Allied Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Academic Score / Grade (% or CGPA) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={academicGrade}
                      onChange={(e) => setAcademicGrade(e.target.value)}
                      required
                      placeholder="e.g. 85.5%"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 3. UDYAM KRANTI MSME LOAN */}
              {schemeType === 'UDYAM_KRANTI' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Proposed Business Enterprise Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={enterpriseName}
                      onChange={(e) => setEnterpriseName(e.target.value)}
                      required
                      placeholder="e.g. Rajesh Tech & Solar Services"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Requested Loan Amount (₹ Up to ₹50 Lakh) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={requestedLoanAmount}
                      onChange={(e) => setRequestedLoanAmount(e.target.value)}
                      required
                      placeholder="e.g. 1500000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none font-bold text-[#0B2A5B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Industry Business Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none bg-white"
                    >
                      <option value="Manufacturing Sector">Manufacturing Sector (₹1 Lakh to ₹50 Lakh)</option>
                      <option value="Services Sector">Services Sector (₹1 Lakh to ₹25 Lakh)</option>
                      <option value="Retail & Trade">Retail & Enterprise Trade</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 4. JAL JEEVAN TAP CONNECTION */}
              {schemeType === 'JAL_JEEVAN' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Gram Panchayat / Urban Ward Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={gramPanchayat}
                      onChange={(e) => setGramPanchayat(e.target.value)}
                      required
                      placeholder="e.g. Central Sector Ward 4"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Village Ward / House No. <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={wardNo}
                      onChange={(e) => setWardNo(e.target.value)}
                      required
                      placeholder="e.g. Ward No. 12"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 5. KISAN CREDIT CARD */}
              {schemeType === 'KISAN_CREDIT' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Total Agricultural Landholding (Acres) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
                      required
                      placeholder="e.g. 3.5"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Khasra / Khatauni Survey Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={khasraNo}
                      onChange={(e) => setKhasraNo(e.target.value)}
                      required
                      placeholder="e.g. KH-892/2026"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Irrigation System Equipment <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={irrigationType}
                      onChange={(e) => setIrrigationType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none bg-white"
                    >
                      <option value="Drip Irrigation System">Drip Irrigation System (50% Subsidy)</option>
                      <option value="Sprinkler System">Sprinkler Micro Irrigation</option>
                      <option value="Solar Agriculture Pump">PM-KUSUM Solar Agriculture Pump</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 6. SOCIAL SECURITY PENSION */}
              {schemeType === 'SOCIAL_PENSION' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Social Security Pension Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={pensionCategory}
                      onChange={(e) => setPensionCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none bg-white"
                    >
                      <option value="Senior Citizen Old Age (60+)">Senior Citizen Old Age (60+ yrs)</option>
                      <option value="Destitute Widow Pension">Destitute Widow Pension</option>
                      <option value="Disability Pension (40%+)">Disability Pension (40%+ Benchmark)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Bank Account Number for Monthly Pension <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankAccountNo}
                      onChange={(e) => setBankAccountNo(e.target.value)}
                      required
                      placeholder="e.g. 918820192811"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {/* 7. SOLAR YOJANA */}
              {schemeType === 'SOLAR' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Monthly Electricity Units (kWh) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={monthlyUnits}
                      onChange={(e) => setMonthlyUnits(e.target.value)}
                      required
                      placeholder="e.g. 240"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Rooftop Area Available (Sq. Ft.) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={rooftopArea}
                      onChange={(e) => setRooftopArea(e.target.value)}
                      required
                      placeholder="e.g. 550"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Electricity DISCOM Consumer No / CA ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={consumerNo}
                      onChange={(e) => setConsumerNo(e.target.value)}
                      required
                      placeholder="e.g. DISCOM-DEL-984712"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Proposed Solar System Capacity <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={solarCapacity}
                      onChange={(e) => setSolarCapacity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none bg-white"
                    >
                      <option value="1 kW">1 kW (Up to ₹30,000 Subsidy)</option>
                      <option value="2 kW">2 kW (Up to ₹60,000 Subsidy)</option>
                      <option value="3 kW">3 kW+ (Maximum ₹78,000 Subsidy)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 8. CERTIFICATES & GENERAL */}
              {(schemeType === 'CERTIFICATE' || schemeType === 'GENERAL') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Father's / Husband's Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fatherHusbandName}
                      onChange={(e) => setFatherHusbandName(e.target.value)}
                      required
                      placeholder="e.g. Suresh Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F1F3D] mb-1">
                      Application Purpose / Usage <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={certificatePurpose}
                      onChange={(e) => setCertificatePurpose(e.target.value)}
                      required
                      placeholder="e.g. University Admission & Statutory Fee Waiver"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6ECF4] text-sm focus:ring-2 focus:ring-[#0B2A5B] outline-none"
                    />
                  </div>
                </div>
              )}

            </div>
          )}

          {/* STEP 3: Scheme-Specific Document Attachments */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Scheme Requirements Banner */}
              <div className="bg-gradient-to-r from-[#08234D] via-[#0B2A5B] to-[#12397A] text-white p-5 rounded-2xl shadow-sm border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="font-extrabold text-sm text-white">
                      Mandatory Required Documents for {service.name}
                    </h3>
                  </div>
                  <p className="text-xs text-amber-200/90 font-medium">
                    Automated document verification via SETU Vault & MeitY DigiLocker Repository.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Document to Vault</span>
                </button>
              </div>

              {/* 1. MANDATORY NATIONAL IDENTITY SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-black text-[#08234D] uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>1. Primary Citizen Identity Proof (Required for All Schemes)</span>
                  </h4>
                  <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Auto-Verified UIDAI e-KYC
                  </span>
                </div>

                {getDisplayDocuments().filter(d => d.type.toUpperCase().includes('AADHAAR')).map((doc) => (
                  <div
                    key={doc.document_id}
                    className="p-4 rounded-2xl border-2 border-amber-400/60 bg-gradient-to-r from-amber-50/50 via-white to-amber-50/30 flex items-center justify-between shadow-xs gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#08234D] text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                        UIDAI
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-extrabold text-sm text-[#0F172A]">Aadhaar Smart Card (UIDAI e-KYC)</h4>
                          <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded uppercase tracking-wider">
                            ⭐ Universal Identity Proof
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">Ref: {doc.storage_uri}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="px-3 py-1.5 bg-[#08234D] hover:bg-[#0F346C] text-amber-300 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border border-amber-400/40"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Document</span>
                      </button>
                      <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        VERIFIED & LINKED
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. SCHEME SPECIFIC REQUIRED DOCUMENTS SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-black text-[#08234D] uppercase tracking-wider flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-blue-600" />
                    <span>2. Scheme Specific Required Certificates & Proofs</span>
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">
                    {service.required_documents ? service.required_documents.split(',').length : 3} Required Documents
                  </span>
                </div>

                <div className="space-y-2.5">
                  {getDisplayDocuments().filter(d => !d.type.toUpperCase().includes('AADHAAR')).map((doc) => {
                    const isChecked = selectedDocs.includes(doc.document_id);
                    return (
                      <div
                        key={doc.document_id}
                        onClick={() => {
                          if (selectedDocs.includes(doc.document_id)) {
                            setSelectedDocs(selectedDocs.filter((id) => id !== doc.document_id));
                          } else {
                            setSelectedDocs([...selectedDocs, doc.document_id]);
                          }
                        }}
                        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all gap-3 ${
                          isChecked
                            ? 'border-[#08234D] bg-blue-50/60 ring-2 ring-[#08234D]/10 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // Handled by container onClick
                            className="rounded text-[#08234D] focus:ring-[#08234D] w-4 h-4 cursor-pointer"
                          />
                          <div className="w-8 h-8 rounded-xl bg-blue-100/60 text-[#08234D] flex items-center justify-center shrink-0 font-bold text-xs">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-sm text-[#0F172A] truncate">
                              {doc.type.replace(/_/g, ' ')}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-mono truncate">{doc.storage_uri}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewDoc(doc);
                            }}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#08234D] border border-blue-200 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-700" />
                            <span>View Document</span>
                          </button>
                          <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                            {doc.verification_status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal for + Add Document */}
              {showAddDocModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
                  <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5">
                    
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#08234D]">
                          <FilePlus className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-[#0F172A]">Add Document to SETU Vault</h3>
                          <p className="text-xs text-slate-500">Upload or link new document for scheme verification</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddDocModal(false)}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddCustomDocument} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-[#0F172A] mb-1">
                          Select Document Category / Type <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={customDocType}
                          onChange={(e) => setCustomDocType(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#08234D] outline-none"
                        >
                          <option value="DOMICILE_CERTIFICATE">Domicile & Native Residence Certificate</option>
                          <option value="INCOME_CERTIFICATE">Income & Tax Certificate</option>
                          <option value="CASTE_CERTIFICATE">Caste / Category Certificate (BC/SC/ST/EWS)</option>
                          <option value="BANK_PASSBOOK">Bank Account Passbook / Cancelled Cheque</option>
                          <option value="LAND_TITLE">Land Revenue Record / Khasra Patta</option>
                          <option value="ELECTRICITY_BILL">DISCOM Electricity Utility Bill</option>
                          <option value="MARKS_MEMO">School / College Academic Marksheet</option>
                          <option value="DISABILITY_CERTIFICATE">Benchmark Disability Medical Certificate</option>
                          <option value="OTHER_SUPPORTING_PROOF">Other Official Government Proof</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-[#0F172A] mb-1">
                          Document Custom Title / Description (Optional)
                        </label>
                        <input
                          type="text"
                          value={customDocName}
                          onChange={(e) => setCustomDocName(e.target.value)}
                          placeholder="e.g. State Domicile Certificate 2026"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-[#08234D] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#0F172A] mb-1">
                          Certificate Reference Number / Serial ID <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={customDocRef}
                          onChange={(e) => setCustomDocRef(e.target.value)}
                          required
                          placeholder="e.g. DOM-2026-98120"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-[#08234D] outline-none"
                        />
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 font-medium text-[11px] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Document will be encrypted with SHA-256 and linked directly to your application.</span>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setShowAddDocModal(false)}
                          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-[#08234D] hover:bg-[#0F346C] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Verify & Link Document</span>
                        </button>
                      </div>
                    </form>

                  </div>
                </div>
              )}

              {/* Document Quick View Preview Modal */}
              {previewDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
                  <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
                    
                    {/* Modal Top Header */}
                    <div className="bg-[#08234D] text-white p-5 flex items-center justify-between border-b border-amber-500/30 shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-white">{previewDoc.type.replace(/_/g, ' ')}</h3>
                          <p className="text-xs text-amber-300 font-mono">Ref: {previewDoc.storage_uri}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(null)}
                        className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Modal Document Body View */}
                    <div className="p-6 space-y-5 overflow-y-auto flex-1 bg-slate-50/50">
                      
                      {previewDoc.type.toUpperCase().includes('AADHAAR') ? (
                        /* UIDAI Aadhaar Card Preview */
                        <div className="bg-gradient-to-b from-amber-500/10 via-white to-emerald-500/10 border-2 border-amber-400/40 rounded-3xl p-6 shadow-md space-y-5 relative overflow-hidden">
                          
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
                            <span className="text-[9px] font-extrabold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> e-KYC VERIFIED
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-4 items-center">
                            <div className="col-span-1 flex flex-col items-center">
                              <div className="w-24 h-28 rounded-2xl border-2 border-[#08234D]/40 shadow-md relative overflow-hidden bg-[#08234D] text-amber-400 flex flex-col items-center justify-center">
                                <div className="text-3xl font-black text-amber-400">
                                  {(fullName || 'R').charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[9px] font-extrabold bg-[#08234D] text-amber-300 w-full text-center py-0.5 absolute bottom-0 uppercase tracking-wider border-t border-amber-400/30">
                                  UIDAI e-KYC
                                </span>
                              </div>
                            </div>

                            <div className="col-span-2 space-y-2 text-xs text-slate-900">
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Name / नाम</p>
                                <p className="font-extrabold text-sm text-[#08234D]">{fullName || 'Rajesh Kumar / राजेश कुमार'}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase">DOB / जन्म तिथि</p>
                                  <p className="font-extrabold text-xs">{dob || '15/08/1995'}</p>
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

                          <div className="pt-3 border-t-2 border-[#08234D]/20 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aadhaar No. / आधार संख्या</p>
                              <p className="text-lg font-black tracking-widest text-[#08234D] font-mono">XXXX-XXXX-9812</p>
                            </div>
                            <div className="bg-white p-1 rounded border border-slate-300 font-mono text-[9px] text-center">
                              <p className="font-bold">QR VERIFIED</p>
                              <p className="text-emerald-600 font-bold">✓ SHA-256</p>
                            </div>
                          </div>

                        </div>
                      ) : (
                        /* Standard Official Government Certificate Preview */
                        <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 shadow-md space-y-6 relative overflow-hidden">
                          
                          {/* Saffron-White-Green Tricolor Bar */}
                          <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500 rounded-full" />

                          <div className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-3">
                              <img src="/india_gov_emblem.jpg" alt="" className="w-10 h-10 object-cover rounded-full border border-amber-400 shadow-xs" />
                              <div>
                                <h4 className="font-black text-sm text-[#08234D]">GOVERNMENT OF INDIA • SETU DIGILOCKER</h4>
                                <p className="text-[10px] text-slate-500 font-semibold">Official Verified Statutory Certificate Document</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider">
                              ✓ {previewDoc.verification_status}
                            </span>
                          </div>

                          <div className="text-center space-y-1 py-2">
                            <h3 className="text-lg font-black text-[#0F172A] tracking-wide uppercase border-b-2 border-amber-400 inline-block px-4 pb-1">
                              {previewDoc.type.replace(/_/g, ' ')}
                            </h3>
                            <p className="text-xs text-slate-500 font-mono pt-1">Certificate Serial No: {previewDoc.checksum.slice(0, 16).toUpperCase()}</p>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Issued To</p>
                                <p className="font-extrabold text-sm text-[#08234D]">{fullName || 'Rajesh Kumar'}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Issue Date</p>
                                <p className="font-extrabold text-sm text-slate-800">
                                  {new Date(previewDoc.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Storage Location</p>
                                <p className="font-mono text-xs text-blue-700 font-bold truncate">{previewDoc.storage_uri}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Security Checksum</p>
                                <p className="font-mono text-[10px] text-slate-600 truncate">{previewDoc.checksum}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span>Cryptographically Signed & Timestamped</span>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] text-slate-400 uppercase font-bold">Issuing Authority</p>
                              <p className="text-xs font-extrabold text-[#08234D]">State Electronic Governance Authority</p>
                            </div>
                          </div>

                        </div>
                      )}

                    </div>

                    {/* Modal Footer Controls */}
                    <div className="bg-slate-100 px-6 py-4 flex items-center justify-between border-t border-slate-200 shrink-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Connected to MeitY DigiLocker Repository</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(null)}
                        className="px-5 py-2 rounded-xl bg-[#08234D] hover:bg-[#0F346C] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        Close Preview
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* STEP 4: Comprehensive Application Review */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs text-slate-700">
                <h3 className="font-extrabold text-[#0F1F3D] text-sm border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span>Application Summary Review</span>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">ALL FIELDS VERIFIED</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><strong className="text-[#0F1F3D]">Applicant Name:</strong> {fullName}</div>
                  <div><strong className="text-[#0F1F3D]">Date of Birth:</strong> {dob}</div>
                  <div><strong className="text-[#0F1F3D]">Mobile Number:</strong> {mobileNumber}</div>
                  <div><strong className="text-[#0F1F3D]">Social Category:</strong> {category}</div>
                  <div><strong className="text-[#0F1F3D]">Declared Income:</strong> ₹{annualIncome}</div>
                  <div><strong className="text-[#0F1F3D]">Target Scheme:</strong> {service.name}</div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-1">
                  <h4 className="font-bold text-[#0B2A5B] text-xs uppercase tracking-wider">Submitted Scheme Particulars</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200">
                    {schemeType === 'LADLI_BEHNA' && (
                      <>
                        <div><strong>Bank Account:</strong> {bankAccountNo}</div>
                        <div><strong>IFSC Code:</strong> {bankIfsc}</div>
                        <div><strong>Marital Status:</strong> {maritalStatus}</div>
                      </>
                    )}
                    {schemeType === 'SEEKHO_KAMAO' && (
                      <>
                        <div><strong>Qualification:</strong> {highestQual}</div>
                        <div><strong>Skill Trade:</strong> {skillTrade}</div>
                        <div><strong>Academic Score:</strong> {academicGrade}</div>
                      </>
                    )}
                    {schemeType === 'UDYAM_KRANTI' && (
                      <>
                        <div><strong>Venture Name:</strong> {enterpriseName}</div>
                        <div><strong>Requested Loan:</strong> ₹{requestedLoanAmount}</div>
                        <div><strong>Category:</strong> {businessCategory}</div>
                      </>
                    )}
                    {schemeType === 'JAL_JEEVAN' && (
                      <>
                        <div><strong>Gram Panchayat:</strong> {gramPanchayat}</div>
                        <div><strong>Ward No:</strong> {wardNo}</div>
                      </>
                    )}
                    {schemeType === 'KISAN_CREDIT' && (
                      <>
                        <div><strong>Landholding:</strong> {landArea} Acres</div>
                        <div><strong>Khasra Survey:</strong> {khasraNo}</div>
                        <div><strong>Irrigation System:</strong> {irrigationType}</div>
                      </>
                    )}
                    {schemeType === 'SOCIAL_PENSION' && (
                      <>
                        <div><strong>Pension Category:</strong> {pensionCategory}</div>
                        <div><strong>Bank Account:</strong> {bankAccountNo}</div>
                      </>
                    )}
                    {schemeType === 'SOLAR' && (
                      <>
                        <div><strong>Monthly Units:</strong> {monthlyUnits} kWh</div>
                        <div><strong>Rooftop Area:</strong> {rooftopArea} Sq. Ft.</div>
                        <div><strong>Consumer No:</strong> {consumerNo}</div>
                      </>
                    )}
                    {(schemeType === 'CERTIFICATE' || schemeType === 'GENERAL') && (
                      <>
                        <div><strong>Father/Husband:</strong> {fatherHusbandName}</div>
                        <div><strong>Purpose:</strong> {certificatePurpose}</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Step 4 Attached Documents Review Section */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <h4 className="font-bold text-[#0B2A5B] text-xs uppercase tracking-wider flex items-center justify-between">
                    <span>Attached Vault Documents ({1 + selectedDocs.length})</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Ready for Gateway Dispatch</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getDisplayDocuments()
                      .filter(d => d.type.toUpperCase().includes('AADHAAR') || selectedDocs.includes(d.document_id))
                      .map((d) => (
                        <div
                          key={d.document_id}
                          className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#08234D]" />
                          <span>{d.type.replace(/_/g, ' ')}</span>
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(d)}
                            className="ml-1 text-[11px] font-extrabold text-blue-700 hover:text-blue-900 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200 flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl text-xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900">Consent Authorization & Gateway Dispatch</h4>
                  <p className="text-emerald-800 mt-0.5">
                    Clicking "Review Consent & Submit" will open explicit authorization window and dispatch to central gateway!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-6 border-t border-[#E6ECF4] flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#0B2A5B] hover:bg-[#12397A] text-white font-bold px-7 py-3 rounded-xl text-sm shadow-md transition-all ml-auto"
            >
              <span>{currentStep === 4 ? 'Review Consent & Submit' : 'Next >'}</span>
              {currentStep < 4 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

        </form>

      </div>

      {/* Explicit Consent Screen Modal before submission */}
      {service && (
        <ConsentModal
          isOpen={showConsentModal}
          service={service}
          requestedFields={['full_name', 'dob', 'annual_income', 'category']}
          purpose={`Processing ${service.name} application through SETU Gateway.`}
          onGrantConsent={handleFinalSubmit}
          onCancel={() => setShowConsentModal(false)}
          loading={submitting}
        />
      )}

    </div>
  );
};


