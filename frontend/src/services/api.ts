import axios from 'axios';
import { GovernmentService, DocumentItem, User } from '../types';

const API_BASE = 'https://setu-backend-ncs7.onrender.com/api/v1'; 
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token & Trace ID
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('setu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const traceId = `tr-fe-${Math.random().toString(36).substring(2, 9)}`;
  config.headers['X-Trace-Id'] = traceId;
  return config;
});

// Fallback Services Catalog (Guarantees services display on live static Vercel hosts)
const MOCK_SERVICES: GovernmentService[] = [
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
    state: 'Central Government',
    required_documents: 'AADHAAR, ELECTRICITY_BILL, RATION_CARD',
    description: 'Rooftop solar installation scheme providing up to 300 units of free electricity per month and direct Central Govt subsidy up to Rs 78,000.'
  },
  {
    service_id: 'svc-lakhpati',
    code: 'LAKHPATI-DIDI-2026',
    name: 'Lakhpati Didi SHG Entrepreneurship & Revolving Fund',
    provider: 'Ministry of Rural Development',
    category: 'Employment & MSME Support',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'Central Government',
    required_documents: 'AADHAAR, BANK_PASSBOOK, RATION_CARD',
    description: 'Empowers rural women in Self-Help Groups (SHGs) with micro-credit loans, financial literacy, and market access to earn Rs 1 Lakh+ annually.'
  },
  {
    service_id: 'svc-ayush',
    code: 'AYUSH-VAYA-70',
    name: 'Ayushman Vaya Vandana Card (Senior Citizen 70+ Health Cover)',
    provider: 'National Health Authority (NHA)',
    category: 'Health & Medical Welfare',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'Central Government',
    required_documents: 'AADHAAR, AGE_PROOF',
    description: 'Universal free health insurance coverage of Rs 5 Lakh per year for all senior citizens aged 70 and above, regardless of income.'
  },
  {
    service_id: 'svc-viksit',
    code: 'VIKSIT-INTERN-2026',
    name: 'PM Viksit Bharat Youth Internship Scheme',
    provider: 'Ministry of Corporate Affairs',
    category: 'Education & Scholarships',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'Central Government',
    required_documents: 'AADHAAR, MARKS_MEMO, DEGREE_CERTIFICATE',
    description: 'Paid 12-month internship opportunities in Top 500 companies with Rs 5,000 monthly stipend and one-time Rs 6,000 incidentals support.'
  },
  {
    service_id: 'svc-apaar',
    code: 'APAAR-EDU-ID',
    name: 'APAAR One Nation One Student Permanent Academic ID',
    provider: 'Ministry of Education & MeitY',
    category: 'Education & Scholarships',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'Central Government',
    required_documents: 'AADHAAR, MARKS_MEMO',
    description: '12-digit lifelong academic registry ID for students to store credits, degrees, marksheets, and transfer certificates digitally.'
  },
  {
    service_id: 'svc-agristack',
    code: 'AGR-AGRISTACK-ID',
    name: 'AgriStack Digital Farmer ID & Land Parcel Registry',
    provider: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Agriculture & Farmers Welfare',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'Central Government',
    required_documents: 'AADHAAR, LAND_TITLE',
    description: 'Dynamic digital identity for farmers linked to Geo-referenced land records for automated crop loans, insurance, and MSP procurement.'
  },
  {
    service_id: 'svc-vishwakarma',
    code: 'VISHWAKARMA-CRAFT',
    name: 'PM Vishwakarma Artisan Toolkit & Collateral-Free Credit',
    provider: 'Ministry of Micro, Small and Medium Enterprises',
    category: 'Employment & MSME Support',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'Central Government',
    required_documents: 'AADHAAR, BANK_PASSBOOK, TRADE_CERTIFICATE',
    description: 'End-to-end support for traditional artisans (18 trades) including 5-day skill training, Rs 15,000 toolkit e-voucher, and Rs 3 Lakh loan at 5% interest.'
  },
  {
    service_id: 'svc-pmay',
    code: 'HSG-PMAY-2026',
    name: 'PM Awas Yojana 2.0 (Urban & Rural Housing Subsidy)',
    provider: 'Ministry of Housing and Urban Affairs',
    category: 'Housing & Site Allotment',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'Central Government',
    required_documents: 'AADHAAR, INCOME_CERTIFICATE, RATION_CARD, LAND_TITLE',
    description: 'Financial assistance and interest subvention up to Rs 2.5 Lakh for construction or purchase of pucca houses for EWS/LIG families.'
  },
  {
    service_id: 'svc-inc',
    code: 'INC-CERT-01',
    name: 'Issuance of Statutory Income Certificate',
    provider: 'Revenue Department (e-District Gateway)',
    category: 'Citizen Certificates',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'State Revenue Mission',
    required_documents: 'AADHAAR, RATION_CARD, SALARY_SLIP',
    description: 'Official revenue certificate certifying family annual income from all sources for scholarships, subsidies, and statutory quotas.'
  },
  {
    service_id: 'svc-res',
    code: 'RES-CERT-02',
    name: 'Issuance of Domicile & Permanent Residence Certificate',
    provider: 'Revenue Department (e-District Gateway)',
    category: 'Citizen Certificates',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'State Revenue Mission',
    required_documents: 'AADHAAR, ELECTRICITY_BILL, LAND_TITLE',
    description: 'Statutory proof of continuous residence in the state for local employment reservations and educational quota admissions.'
  },
  {
    service_id: 'svc-cst',
    code: 'CST-CERT-03',
    name: 'Issuance of Caste & Social Category Certificate (SC/ST/OBC)',
    provider: 'Department of Social Justice',
    category: 'Citizen Certificates',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'State Revenue Mission',
    required_documents: 'AADHAAR, FATHER_CASTE_PROOF, RATION_CARD',
    description: 'Official social category identity proof for statutory constitutional reservations in education and government recruitment.'
  },
  {
    service_id: 'svc-sch',
    code: 'SCH-POST-MATRIC',
    name: 'Post-Matric Tuition Fee Waiver & Student Scholarship',
    provider: 'Department of Higher Education',
    category: 'Education & Scholarships',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'Higher Education Department',
    required_documents: 'AADHAAR, MARKS_MEMO, INCOME_CERTIFICATE, BANK_PASSBOOK',
    description: 'Full tuition fee reimbursement and monthly maintenance allowance for eligible SC/ST/OBC/EWS students pursuing higher education.'
  },
  {
    service_id: 'svc-rto',
    code: 'RTO-DL-LLR',
    name: 'Learner Driving License & Smart Card DL Issuance',
    provider: 'Transport Department (Parivahan Sewa)',
    category: 'Transport & RTO Services',
    integration_type: 'OFFICIAL_SANDBOX',
    state: 'Transport Department',
    required_documents: 'AADHAAR, AGE_PROOF, MEDICAL_CERTIFICATE',
    description: 'Aadhaar e-KYC based instant contactless Learner License test and driving license booking via Parivahan national portal.'
  }
];

const MOCK_USER: User = {
  user_id: 'u-rajesh-101',
  email: 'rajeshkumar@gmail.com',
  mobile_number: '9876543210',
  role: 'CITIZEN',
  profile: {
    profile_id: 'prof-rajesh-101',
    user_id: 'u-rajesh-101',
    full_name: 'Rajesh Kumar',
    dob: '1995-08-15',
    gender: 'Male',
    demo_address: 'House 142, Sector 4, Central District',
    district: 'Central District',
    state: 'Delhi NCR',
    prototype_cit_id: 'SETU-CIT-981240',
    annual_income: 180000,
    category: 'OBC',
    version: 1
  }
};

const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    document_id: 'doc-aadhaar-1',
    user_id: 'u-rajesh-101',
    type: 'AADHAAR',
    storage_uri: 'vault://documents/aadhaar_uidai_9812.pdf',
    checksum: 'sha256_uidai_aadhaar_verified_981240',
    verification_status: 'VERIFIED',
    created_at: '2026-01-10T00:00:00.000Z'
  },
  {
    document_id: 'doc-income-1',
    user_id: 'u-rajesh-101',
    type: 'INCOME_CERTIFICATE',
    storage_uri: 'vault://documents/income_cert_2026.pdf',
    checksum: 'sha256_income_cert_2026_verified',
    verification_status: 'VERIFIED',
    created_at: '2026-02-14T00:00:00.000Z'
  },
  {
    document_id: 'doc-ration-1',
    user_id: 'u-rajesh-101',
    type: 'RATION_CARD',
    storage_uri: 'vault://documents/ration_card_family.pdf',
    checksum: 'sha256_ration_card_family_verified',
    verification_status: 'VERIFIED',
    created_at: '2026-02-14T00:00:00.000Z'
  },
  {
    document_id: 'doc-passbook-1',
    user_id: 'u-rajesh-101',
    type: 'BANK_PASSBOOK',
    storage_uri: 'vault://documents/sbi_passbook_9188.pdf',
    checksum: 'sha256_sbi_passbook_9188_verified',
    verification_status: 'VERIFIED',
    created_at: '2026-06-01T00:00:00.000Z'
  }
];

// Fallback Interceptor for Offline/Network-only failures on Public Catalog
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If request fails due to 401 Unauthorized, remove invalid/expired token so user can log in again
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('setu_token');
    }

    const config = error.config || {};
    const url: string = config.url || '';
    const method: string = (config.method || 'get').toLowerCase();

    // Fallback ONLY for public services catalog if live server is waking up or offline
    if (url.includes('/services') && method === 'get' && (!error.response || error.response.status >= 500 || error.code === 'ERR_NETWORK')) {
      console.warn(`[SETU Gateway Fallback] Public services catalog offline fallback activated for ${url}`);
      const params = config.params || {};
      let filtered = [...MOCK_SERVICES];
      if (params.category && params.category !== 'ALL') {
        const cat = params.category.toUpperCase();
        filtered = filtered.filter(s => s.category.toUpperCase().includes(cat) || cat.includes(s.category.toUpperCase()));
      }
      if (params.search) {
        const q = params.search.toUpperCase();
        filtered = filtered.filter(s => s.name.toUpperCase().includes(q) || s.code.toUpperCase().includes(q) || s.provider.toUpperCase().includes(q));
      }
      return Promise.resolve({ data: { services: filtered } });
    }

    // Pass through real API errors for authentication, consents, documents, and applications
    return Promise.reject(error);
  }
);

export default api;
