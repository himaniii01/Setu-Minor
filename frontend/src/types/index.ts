export type IntegrationType =
  | 'MOCK_SIMULATION'
  | 'PUBLIC_OPEN_DATA'
  | 'OFFICIAL_SANDBOX'
  | 'PARTNER_ONLY'
  | 'REDIRECT_ONLY';

export type CanonicalStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ACTION_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'FAILED_SYNC'
  | 'CANCELLED';

export interface User {
  user_id: string;
  email: string;
  mobile_number: string;
  role: 'CITIZEN' | 'ADMIN' | 'PROVIDER';
  profile?: CitizenProfile;
}

export interface CitizenProfile {
  profile_id: string;
  user_id: string;
  full_name: string;
  dob: string;
  gender: string;
  demo_address: string;
  district: string;
  state: string;
  prototype_cit_id: string;
  annual_income: number;
  category: string;
  version: number;
}

export interface APIRegistry {
  api_registry_id: string;
  service_name: string;
  base_url: string;
  docs_url: string;
  protocol: 'REST' | 'SOAP_XML';
  auth_type: string;
  access_class: string;
  health: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  simulate_failure: boolean;
  last_success_at?: string;
}

export interface GovernmentService {
  service_id: string;
  code: string;
  name: string;
  provider: string;
  category: string;
  integration_type: IntegrationType;
  state: string;
  required_documents: string;
  description: string;
  api_registry_id?: string;
  api_registry?: APIRegistry;
}

export interface ConsentRecord {
  consent_id: string;
  user_id: string;
  recipient_service_id: string;
  purpose: string;
  requested_fields: string; // JSON string
  status: 'GRANTED' | 'DENIED' | 'REVOKED' | 'EXPIRED';
  expires_at: string;
  created_at: string;
  service?: GovernmentService;
}

export interface ApplicationStatusHistory {
  status_id: string;
  application_id: string;
  canonical_status: CanonicalStatus;
  provider_status: string;
  source: string;
  message: string;
  created_at: string;
}

export interface ServiceApplication {
  application_id: string;
  user_id: string;
  service_id: string;
  external_ref: string;
  canonical_status: CanonicalStatus;
  consent_id?: string;
  idempotency_key: string;
  form_data: string;
  created_at: string;
  updated_at: string;
  service: GovernmentService;
  statuses?: ApplicationStatusHistory[];
  consent?: ConsentRecord;
}

export interface DocumentItem {
  document_id: string;
  user_id: string;
  type: string;
  storage_uri: string;
  checksum: string;
  verification_status: string;
  expiry?: string;
  created_at: string;
}

export interface GrievanceItem {
  grievance_id: string;
  user_id: string;
  department: string;
  subject: string;
  description: string;
  district_area: string;
  urgency: 'NORMAL' | 'URGENT' | 'CRITICAL';
  status: string;
  reference_no: string;
  created_at: string;
}

export interface AuditLogItem {
  audit_id: string;
  actor: string;
  action: string;
  resource: string;
  trace_id: string;
  redacted_metadata: string;
  timestamp: string;
}
