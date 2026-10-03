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

export interface ProviderStatusPayload {
  providerStatus: string;
  sourceConnector: string;
  integrationType: string;
  rawMessage?: string;
  externalRef: string;
}

export interface NormalizedStatusResult {
  externalApplicationRef: string;
  canonicalStatus: CanonicalStatus;
  statusMessage: string;
  source: string;
  integrationType: string;
  providerStatus: string;
}

export function mapProviderToCanonical(payload: ProviderStatusPayload): NormalizedStatusResult {
  const statusUpper = (payload.providerStatus || '').toUpperCase();
  let canonical: CanonicalStatus = 'UNDER_REVIEW';
  let userFriendlyMessage = payload.rawMessage || 'Your application is being processed.';

  switch (statusUpper) {
    case 'RECEIVED':
    case 'INITIATED':
    case 'LOGGED':
      canonical = 'SUBMITTED';
      userFriendlyMessage = 'Application received and registered at the central provider gateway.';
      break;

    case 'PENDING_TAHSILDAR':
    case 'INSPECTION_COMPLETED':
    case 'VERIFICATION_IN_PROGRESS':
    case 'IN_PROCESS':
      canonical = 'UNDER_REVIEW';
      userFriendlyMessage = 'Application is currently under statutory review by designated officers.';
      break;

    case 'DOCUMENT_DEFICIENT':
    case 'CLARIFICATION_NEEDED':
      canonical = 'ACTION_REQUIRED';
      userFriendlyMessage = 'Action required: Additional documentation or clarification is needed.';
      break;

    case 'SANCTIONED':
    case 'APPROVED':
      canonical = 'APPROVED';
      userFriendlyMessage = 'Application has been approved and benefit sanctioned.';
      break;

    case 'ISSUED':
    case 'DISPATCHED':
    case 'COMPLETED':
      canonical = 'COMPLETED';
      userFriendlyMessage = 'Certificate/service extract successfully generated and issued.';
      break;

    case 'REJECTED':
    case 'DISMISSED':
      canonical = 'REJECTED';
      userFriendlyMessage = 'Application was rejected following statutory verification.';
      break;

    case 'TIMEOUT':
    case 'FAILED_SYNC':
    case 'CONNECTOR_OFFLINE':
      canonical = 'FAILED_SYNC';
      userFriendlyMessage = 'Pending synchronization: Service provider endpoint timed out. Retrying automatically.';
      break;

    case 'CANCELLED':
    case 'WITHDRAWN':
      canonical = 'CANCELLED';
      userFriendlyMessage = 'Application was cancelled by applicant request.';
      break;

    default:
      canonical = 'UNDER_REVIEW';
      userFriendlyMessage = payload.rawMessage || `Provider status: ${payload.providerStatus}`;
  }

  return {
    externalApplicationRef: payload.externalRef,
    canonicalStatus: canonical,
    statusMessage: userFriendlyMessage,
    source: payload.sourceConnector,
    integrationType: payload.integrationType,
    providerStatus: payload.providerStatus
  };
}
