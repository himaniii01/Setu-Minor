import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SETU Database Seeding for 2026 Government Schemes & Services...');

  // Clean existing tables
  await prisma.auditLog.deleteMany({});
  await prisma.aPITransaction.deleteMany({});
  await prisma.applicationStatus.deleteMany({});
  await prisma.serviceApplication.deleteMany({});
  await prisma.consentRecord.deleteMany({});
  await prisma.governmentService.deleteMany({});
  await prisma.aPIRegistry.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.citizenProfile.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.grievance.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('Password123!', 10);
  const adminPasswordHash = await bcrypt.hash('AdminPass123!', 10);

  // 1. Create Users
  const citizen1 = await prisma.user.create({
    data: {
      email: 'rajeshkumar@gmail.com',
      mobile_number: '9876543210',
      password_hash: passwordHash,
      role: 'CITIZEN',
      profile: {
        create: {
          full_name: 'Rajesh Kumar',
          dob: '1995-08-15',
          gender: 'Male',
          demo_address: 'Flat 402, Green Valley Apartments, MG Road',
          district: 'Central District',
          state: 'National Capital Territory',
          prototype_cit_id: 'SETU-CIT-000123',
          annual_income: 140000,
          category: 'BC',
          college_attendance: 88.5
        }
      }
    },
    include: { profile: true }
  });

  const citizen2 = await prisma.user.create({
    data: {
      email: 'sunitadevi@setu.gov.in',
      mobile_number: '9812345678',
      password_hash: passwordHash,
      role: 'CITIZEN',
      profile: {
        create: {
          full_name: 'Sunita Devi',
          dob: '1998-11-20',
          gender: 'Female',
          demo_address: 'House 12, Ward 4, Lakeview Colony',
          district: 'North District',
          state: 'State Neutral Union',
          prototype_cit_id: 'SETU-CIT-000456',
          annual_income: 95000,
          category: 'SC',
          college_attendance: 92.0
        }
      }
    }
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@setu.gov.in',
      mobile_number: '9000000000',
      password_hash: adminPasswordHash,
      role: 'ADMIN'
    }
  });

  console.log('✅ Created Demo Users & Profiles');

  // 2. Create Fictional Documents for Citizen 1 (Rajesh Kumar)
  await prisma.document.createMany({
    data: [
      {
        user_id: citizen1.user_id,
        type: 'AADHAAR_CARD',
        storage_uri: 'vault://documents/aadhaar_smart_card_9918.pdf',
        checksum: 'aadhaar991820268821sha256verified',
        verification_status: 'VERIFIED',
        expiry: '2035-12-31'
      },
      {
        user_id: citizen1.user_id,
        type: 'PAN_CARD',
        storage_uri: 'vault://documents/pan_card_abcpk9847l.pdf',
        checksum: 'panabcpk9847l2026sha256verified',
        verification_status: 'VERIFIED',
        expiry: '2040-12-31'
      },
      {
        user_id: citizen1.user_id,
        type: 'INCOME_CERTIFICATE',
        storage_uri: 'vault://documents/income_cert_2026.pdf',
        checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        verification_status: 'VERIFIED',
        expiry: '2027-03-31'
      },
      {
        user_id: citizen1.user_id,
        type: 'MARKS_MEMO',
        storage_uri: 'vault://documents/marksheet_degree.pdf',
        checksum: 'f4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149afb',
        verification_status: 'VERIFIED'
      },
      {
        user_id: citizen1.user_id,
        type: 'RATION_CARD',
        storage_uri: 'vault://documents/ration_card_family.pdf',
        checksum: '991b7852b855e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495',
        verification_status: 'VERIFIED'
      },
      {
        user_id: citizen1.user_id,
        type: 'ELECTRICITY_BILL',
        storage_uri: 'vault://documents/discom_electricity_bill_2026.pdf',
        checksum: 'discom984712bill2026sha256',
        verification_status: 'VERIFIED'
      },
      {
        user_id: citizen1.user_id,
        type: 'RESIDENCE_PROOF',
        storage_uri: 'vault://documents/domicile_native_cert_2026.pdf',
        checksum: 'domicile2026nativecertsha256',
        verification_status: 'VERIFIED'
      },
      {
        user_id: citizen1.user_id,
        type: 'BANK_PASSBOOK',
        storage_uri: 'vault://documents/sbi_bank_passbook_9188.pdf',
        checksum: 'sbibankpassbook918820192811',
        verification_status: 'VERIFIED'
      },
      {
        user_id: citizen1.user_id,
        type: 'LAND_TITLE',
        storage_uri: 'vault://documents/khasra_land_record_892.pdf',
        checksum: 'khasralandrecord8922026sha256',
        verification_status: 'VERIFIED'
      }
    ]
  });

  // 3. Create API Registries
  const edistrictApi = await prisma.aPIRegistry.create({
    data: {
      service_name: 'e-District Services API Gateway',
      base_url: 'https://edistrict.gov.in/api/v1',
      docs_url: 'https://edistrict.gov.in/docs',
      protocol: 'REST',
      auth_type: 'API_KEY',
      access_class: 'RESTRICTED',
      health: 'HEALTHY',
      last_success_at: new Date()
    }
  });

  const scholarshipApi = await prisma.aPIRegistry.create({
    data: {
      service_name: 'National Scholarship Portal Gateway',
      base_url: 'https://scholarships.gov.in/api/v2',
      docs_url: 'https://scholarships.gov.in/docs',
      protocol: 'REST',
      auth_type: 'OAUTH2',
      access_class: 'RESTRICTED',
      health: 'HEALTHY',
      last_success_at: new Date()
    }
  });

  const pmsuryaApi = await prisma.aPIRegistry.create({
    data: {
      service_name: 'PM Surya Ghar Solar Portal',
      base_url: 'https://pmsuryaghar.gov.in/api/v1',
      docs_url: 'https://pmsuryaghar.gov.in/developer',
      protocol: 'REST',
      auth_type: 'API_KEY',
      access_class: 'OPEN',
      health: 'HEALTHY',
      last_success_at: new Date()
    }
  });

  // 4. Create Government Services (14+ official 2026 services with benefits)
  const servicesData = [
    {
      code: 'PM-SOLAR-2026',
      name: 'PM Surya Ghar: Muft Bijli Yojana (2026 Solar Subsidy)',
      provider: 'Ministry of New and Renewable Energy',
      category: 'Municipal & Civic Amenities',
      integration_type: 'OFFICIAL_SANDBOX',
      state: 'All India Union & States',
      required_documents: 'ELECTRICITY_BILL, RESIDENCE_PROOF',
      description: 'Provides free electricity up to 300 units per month for households with a central capital subsidy of up to Rs. 78,000 for rooftop solar installation.',
      api_registry_id: pmsuryaApi.api_registry_id
    },
    {
      code: 'SCH-POST-01',
      name: 'Post-Matric Tuition Fee Reimbursement',
      provider: 'Department of Higher Education',
      category: 'Education & Scholarships',
      integration_type: 'OFFICIAL_SANDBOX',
      state: 'Central & State Neutral',
      required_documents: 'INCOME_CERTIFICATE, MARKS_MEMO',
      description: '100% full tuition fee waiver and annual maintenance allowance for eligible college students meeting statutory income and attendance criteria.',
      api_registry_id: scholarshipApi.api_registry_id
    },
    {
      code: 'INC-CERT-01',
      name: 'Issuance of Income Certificate',
      provider: 'e-District Revenue Department',
      category: 'Citizen Certificates',
      integration_type: 'OFFICIAL_SANDBOX',
      state: 'State Revenue Department',
      required_documents: 'INCOME_CERTIFICATE, RATION_CARD',
      description: 'Official Tahsildar verified annual family income certificate required for educational, scholarship and statutory fee concessions.',
      api_registry_id: edistrictApi.api_registry_id
    },
    {
      code: 'LAKHPATI-DIDI-2026',
      name: 'Lakhpati Didi SHG Women Empowerment Scheme (2026)',
      provider: 'Ministry of Rural Development',
      category: 'Education & Scholarships',
      integration_type: 'PARTNER_ONLY',
      state: 'National Rural Livelihoods',
      required_documents: 'SHG_MEMBERSHIP_ID, BANK_PASSBOOK',
      description: 'Skill training, micro-credit access, and market linkage for women members of Self-Help Groups (SHGs) targeting Rs. 1 Lakh annual sustainable income.',
      api_registry_id: edistrictApi.api_registry_id
    },
    {
      code: 'AYUSH-SENIOR-70',
      name: 'Ayushman Vaya Vandana Card (Senior Citizen 70+)',
      provider: 'National Health Authority (NHA)',
      category: 'Health & Medical Welfare',
      integration_type: 'OFFICIAL_SANDBOX',
      state: 'All India Central',
      required_documents: 'AGE_PROOF, RATION_CARD',
      description: 'Free cashless health insurance coverage up to Rs. 5 Lakh per year for all senior citizens aged 70 and above, regardless of family income.',
      api_registry_id: edistrictApi.api_registry_id
    },
    {
      code: 'VIKSIT-YUVA-2026',
      name: 'Viksit Bharat Yuva Apprenticeship & Internship Scheme',
      provider: 'Ministry of Skill Development & Entrepreneurship',
      category: 'Education & Scholarships',
      integration_type: 'OFFICIAL_SANDBOX',
      state: 'All India Union',
      required_documents: 'DEGREE_CERTIFICATE, RESIDENCE_PROOF',
      description: 'Monthly direct stipend of Rs. 5,000 for 12 months plus one-time assistance of Rs. 6,000 for youth placed in top Indian corporate enterprises.',
      api_registry_id: scholarshipApi.api_registry_id
    },
    {
      code: 'APAAR-ID-2026',
      name: 'ONE Nation ONE Student ID (APAAR ID Portal)',
      provider: 'Ministry of Education & Academic Bank of Credits',
      category: 'Education & Scholarships',
      integration_type: 'PUBLIC_OPEN_DATA',
      state: 'All India National',
      required_documents: 'STUDENT_ID, MARKS_MEMO',
      description: 'Permanent 12-digit academic ID tracking student learning credits, certificates, degrees, and co-curricular achievements digitally.',
      api_registry_id: scholarshipApi.api_registry_id
    },
    {
      code: 'AGR-AGRISTACK',
      name: 'Digital Agriculture Mission & Agristack Farmer ID',
      provider: 'Ministry of Agriculture & Farmers Welfare',
      category: 'Agriculture & Farmers Welfare',
      integration_type: 'PUBLIC_OPEN_DATA',
      state: 'Central & State Agriculture',
      required_documents: 'LAND_TITLE',
      description: 'Digital farmer registry providing instant access to crop insurance, soil health cards, customized advisory, and PM-KISAN direct benefit transfers.',
      api_registry_id: pmsuryaApi.api_registry_id
    },
    {
      code: 'VISHWAKARMA-2026',
      name: 'PM Vishwakarma Artisan Support Scheme',
      provider: 'Ministry of Micro, Small & Medium Enterprises',
      category: 'Agriculture & Farmers Welfare',
      integration_type: 'OFFICIAL_SANDBOX',
      state: 'All India Union',
      required_documents: 'ARTISAN_DECLARATION, BANK_PASSBOOK',
      description: 'Collateral-free credit support up to Rs. 3 Lakh at 5% interest, Rs. 15,000 toolkit incentive, and free skill enhancement for traditional artisans.',
      api_registry_id: edistrictApi.api_registry_id
    },
    {
      code: 'HSG-PMAY-2',
      name: 'PM Awas Yojana 2.0 (Urban & Rural Housing)',
      provider: 'Ministry of Housing and Urban Affairs',
      category: 'Housing & Site Allotment',
      integration_type: 'REDIRECT_ONLY',
      state: 'All India Union',
      required_documents: 'INCOME_CERTIFICATE, RESIDENCE_PROOF',
      description: 'Financial assistance and credit-linked interest subsidy up to Rs. 2.67 Lakh for constructing or purchasing a first home.',
      api_registry_id: null
    },
    {
      code: 'RES-CERT-02',
      name: 'Residence & Native Certificate',
      provider: 'Tahsildar Civic Cell',
      category: 'Citizen Certificates',
      integration_type: 'OFFICIAL_SANDBOX',
      state: 'State Revenue Department',
      required_documents: 'RATION_CARD',
      description: 'Domicile proof for state welfare schemes, university admissions, and government employment applications.',
      api_registry_id: edistrictApi.api_registry_id
    },
    {
      code: 'CST-CERT-03',
      name: 'Caste & Community Certificate',
      provider: 'Social Welfare & Revenue Dept',
      category: 'Citizen Certificates',
      integration_type: 'OFFICIAL_SANDBOX',
      state: 'State Revenue Department',
      required_documents: 'INCOME_CERTIFICATE, RATION_CARD',
      description: 'Statutory category verification certificate for BC, SC, ST and EWS applicants for statutory reservation benefits.',
      api_registry_id: edistrictApi.api_registry_id
    },
    {
      code: 'MNC-BRT-01',
      name: 'Birth Registration & Extract',
      provider: 'Municipal Health Department',
      category: 'Municipal & Civic Amenities',
      integration_type: 'OFFICIAL_SANDBOX',
      state: 'Urban Local Bodies',
      required_documents: 'HOSPITAL_DISCHARGE_MEMO',
      description: 'Municipal vital statistics registration and digital birth extract issuance.',
      api_registry_id: edistrictApi.api_registry_id
    },
    {
      code: 'MP-SCH-001',
      name: 'Mukhyamantri Ladli Behna Yojana (Women Financial Aid)',
      provider: 'Department of Women & Child Development',
      category: 'Social Welfare & Financial Assistance',
      integration_type: 'OFFICIAL_SANDBOX',
      state: 'State Livelihoods Mission',
      required_documents: 'AADHAAR, RATION_CARD, BANK_PASSBOOK, RESIDENCE_PROOF',
      description: 'Direct monthly financial assistance of Rs 1,250 directly transferred to eligible married, widowed, and destitute women for financial independence.',
      api_registry_id: edistrictApi.api_registry_id
    },
    {
      code: 'MP-SCH-003',
      name: 'Mukhyamantri Seekho-Kamao Yojana (Skill & Stipend)',
      provider: 'Department of Technical Education & Skill Development',
      category: 'Education & Scholarships',
      integration_type: 'OFFICIAL_SANDBOX',
      state: 'Skill Development Corporation',
      required_documents: 'AADHAAR, MARKS_MEMO, DEGREE_CERTIFICATE, BANK_PASSBOOK',
      description: 'Skill enhancement program providing hands-on industry training along with a monthly direct stipend of Rs 8,000 to Rs 10,000 for youth.',
      api_registry_id: scholarshipApi.api_registry_id
    },
    {
      code: 'MP-SCH-007',
      name: 'Mukhyamantri Udyam Kranti Yojana (MSME Enterprise Loan)',
      provider: 'Department of Micro, Small & Medium Enterprises',
      category: 'Employment & MSME Support',
      integration_type: 'OFFICIAL_SANDBOX',
      state: 'MSME Development Cell',
      required_documents: 'AADHAAR, PAN_CARD, INCOME_CERTIFICATE',
      description: 'Bank collateral-free self-employment loans up to Rs 50 Lakh for youth with 3% interest subsidy and full 7-year guarantee fee reimbursement.',
      api_registry_id: edistrictApi.api_registry_id
    },
    {
      code: 'MP-SCH-021',
      name: 'Jal Jeevan Mission Household Tap Connection (FHTC)',
      provider: 'Public Health Engineering Department',
      category: 'Municipal & Civic Amenities',
      integration_type: 'PUBLIC_OPEN_DATA',
      state: 'Rural Water Supply Mission',
      required_documents: 'AADHAAR, RESIDENCE_PROOF',
      description: 'Provides guaranteed safe drinking water tap connection to every rural household with quality testing and maintenance.',
      api_registry_id: pmsuryaApi.api_registry_id
    },
    {
      code: 'MP-SCH-024',
      name: 'Kisan Credit Card & Irrigation Equipment Subsidy',
      provider: 'Department of Agriculture & Farmers Welfare',
      category: 'Agriculture & Farmers Welfare',
      integration_type: 'OFFICIAL_SANDBOX',
      state: 'Agriculture Department',
      required_documents: 'AADHAAR, LAND_TITLE, BANK_PASSBOOK',
      description: 'Subsidized micro-irrigation systems (drip/sprinkler) and low-interest crop credit up to Rs 3 Lakh via Kisan Credit Card for small and marginal farmers.',
      api_registry_id: pmsuryaApi.api_registry_id
    },
    {
      code: 'MP-SCH-052',
      name: 'Social Security Old Age, Widow & Disability Pension',
      provider: 'Department of Social Justice & Disabled Welfare',
      category: 'Social Welfare & Pension',
      integration_type: 'OFFICIAL_SANDBOX',
      state: 'Social Security Mission',
      required_documents: 'AADHAAR, AGE_PROOF, INCOME_CERTIFICATE',
      description: 'Direct monthly pension transfers to senior citizens aged 60+, destitute widows, and persons with 40%+ benchmark disability.',
      api_registry_id: edistrictApi.api_registry_id
    },
    {
      code: 'MP-SCH-008',
      name: 'Mukhyamantri Kanya Vivah & Nikah Financial Assistance',
      provider: 'Department of Social Justice',
      category: 'Social Welfare & Financial Assistance',
      integration_type: 'OFFICIAL_SANDBOX',
      state: 'Social Justice Department',
      required_documents: 'AADHAAR, INCOME_CERTIFICATE, RATION_CARD',
      description: 'Financial assistance of Rs 51,000 per eligible bride from needy families for marriage arrangements and household setup.',
      api_registry_id: edistrictApi.api_registry_id
    },
    {
      code: 'REV-LND-01',
      name: 'Land Record Extract (Adangal / Pahani)',
      provider: 'Survey and Land Records Dept',
      category: 'Revenue & Land Records',
      integration_type: 'PUBLIC_OPEN_DATA',
      state: 'Revenue Department',
      required_documents: 'SURVEY_NUMBER',
      description: 'Instant download of certified digital land ownership extracts and survey maps.',
      api_registry_id: null
    }
  ];

  const createdServices: Record<string, any> = {};
  for (const s of servicesData) {
    const service = await prisma.governmentService.create({ data: s });
    createdServices[s.code] = service;
  }

  console.log('✅ Created 14 Government Services & 2026 Schemes');

  // 5. Create Active Consent Record for Citizen 1
  const consent1 = await prisma.consentRecord.create({
    data: {
      user_id: citizen1.user_id,
      recipient_service_id: createdServices['SCH-POST-01'].service_id,
      purpose: 'Verification of family income and educational record for tuition fee reimbursement',
      requested_fields: JSON.stringify(['full_name', 'dob', 'annual_income', 'category', 'college_attendance']),
      status: 'GRANTED',
      expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
    }
  });

  const consent2 = await prisma.consentRecord.create({
    data: {
      user_id: citizen1.user_id,
      recipient_service_id: createdServices['INC-CERT-01'].service_id,
      purpose: 'Tahsildar verification of annual family income declaration',
      requested_fields: JSON.stringify(['full_name', 'demo_address', 'district', 'annual_income']),
      status: 'GRANTED',
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    }
  });

  console.log('✅ Created Consent Records');

  // 6. Create Service Applications & Status Timelines
  await prisma.serviceApplication.create({
    data: {
      user_id: citizen1.user_id,
      service_id: createdServices['INC-CERT-01'].service_id,
      external_ref: 'SETU-ED-2026-00045',
      canonical_status: 'UNDER_REVIEW',
      consent_id: consent2.consent_id,
      idempotency_key: 'idem-inc-00045-citizen1',
      form_data: JSON.stringify({
        applicantName: 'Rajesh Kumar',
        declaredIncome: '140000',
        district: 'Central District',
        purpose: 'Higher Education Fee Concession'
      }),
      statuses: {
        create: [
          {
            canonical_status: 'SUBMITTED',
            provider_status: 'RECEIVED',
            source: 'e-District Central Gateway',
            message: 'Application received successfully at central provider gateway.'
          },
          {
            canonical_status: 'UNDER_REVIEW',
            provider_status: 'PENDING_TAHSILDAR',
            source: 'e-District Revenue Department',
            message: 'Application is under review by the designated Tahsildar officer.'
          }
        ]
      }
    }
  });

  await prisma.serviceApplication.create({
    data: {
      user_id: citizen1.user_id,
      service_id: createdServices['PM-SOLAR-2026'].service_id,
      external_ref: 'SETU-SOL-2026-00892',
      canonical_status: 'APPROVED',
      consent_id: consent1.consent_id,
      idempotency_key: 'idem-sol-00892-citizen1',
      form_data: JSON.stringify({
        applicantName: 'Rajesh Kumar',
        subsidyAmount: 'Rs 78,000',
        capacity: '3kW Rooftop Solar'
      }),
      statuses: {
        create: [
          {
            canonical_status: 'SUBMITTED',
            provider_status: 'RECEIVED',
            source: 'PM Surya Ghar Gateway',
            message: 'Solar rooftop subsidy application logged.'
          },
          {
            canonical_status: 'APPROVED',
            provider_status: 'SANCTIONED',
            source: 'Ministry of New and Renewable Energy',
            message: 'Central subsidy sanctioned. Disbursal in progress.'
          }
        ]
      }
    }
  });

  console.log('✅ Created Applications & Timelines');
  console.log('🎉 2026 Government Schemes Seeding Completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    (globalThis as any).process?.exit?.(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
