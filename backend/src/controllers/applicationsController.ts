import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';
import { sendStandardError } from '../utils/helpers';
import { logAuditEvent } from '../middlewares/auditMiddleware';
import {
  submitEdistrictIncomeCertificate,
  submitScholarshipApplication,
  submitMunicipalBirthRegistration
} from '../connectors';

const prisma = new PrismaClient();

export const submitApplication = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const { service_id, consent_id, idempotency_key, form_data } = req.body;
    const traceId = (res.getHeader('X-Trace-Id') as string) || 'tr-app-sub';

    if (!userId) return sendStandardError(res, 401, 'UNAUTHORIZED', 'Not authenticated');
    if (!service_id || !idempotency_key) {
      return sendStandardError(res, 400, 'VALIDATION_ERROR', 'Service ID and Idempotency Key are required');
    }

    // 1. Check Idempotency Key
    const existingIdem = await prisma.serviceApplication.findUnique({
      where: { idempotency_key },
      include: { service: true, statuses: true }
    });

    if (existingIdem) {
      return res.status(200).json({
        message: 'Application retrieved via Idempotency Key (No duplicate submitted)',
        isDuplicatePrevented: true,
        application: existingIdem
      });
    }

    // 2. Validate Service
    const service = await prisma.governmentService.findUnique({
      where: { service_id },
      include: { api_registry: true }
    });

    if (!service) {
      return sendStandardError(res, 404, 'NOT_FOUND', 'Target service not found');
    }

    // 3. Verify Active Consent
    let consentRecord = null;
    if (consent_id) {
      consentRecord = await prisma.consentRecord.findFirst({
        where: {
          consent_id,
          user_id: userId,
          recipient_service_id: service_id,
          status: 'GRANTED'
        }
      });
    } else {
      // Find any active consent granted for this service
      consentRecord = await prisma.consentRecord.findFirst({
        where: {
          user_id: userId,
          recipient_service_id: service_id,
          status: 'GRANTED'
        }
      });
    }

    if (!consentRecord || consentRecord.expires_at < new Date()) {
      await logAuditEvent(`user:${userId}`, 'GATEWAY_BLOCKED_NO_CONSENT', `service:${service_id}`, traceId, {
        service_name: service.name
      });
      return sendStandardError(
        res,
        403,
        'GATEWAY_CONSENT_REQUIRED',
        'Valid active citizen consent is required before routing request through SETU gateway.'
      );
    }

    // 4. Check for Simulated Endpoint Failure
    const simulateFailure = service.api_registry?.simulate_failure || false;

    // 5. Route to Connector Adapter based on service code
    let connectorRes;
    const startMs = Date.now();

    if (service.code.startsWith('INC-CERT') || service.code.startsWith('RES-CERT') || service.code.startsWith('CST-CERT')) {
      connectorRes = await submitEdistrictIncomeCertificate(form_data, simulateFailure);
    } else if (service.code.startsWith('SCH-')) {
      connectorRes = await submitScholarshipApplication(form_data, simulateFailure);
    } else if (service.code.startsWith('MNC-BRT')) {
      connectorRes = await submitMunicipalBirthRegistration(form_data, simulateFailure);
    } else {
      // Generic mock fallback connector
      const randomRefNum = Math.floor(10000 + Math.random() * 90000);
      const externalRef = `SETU-${service.code.slice(0, 3)}-2026-${randomRefNum}`;
      connectorRes = {
        success: !simulateFailure,
        externalRef,
        providerStatus: simulateFailure ? 'TIMEOUT' : 'RECEIVED',
        normalized: {
          externalApplicationRef: externalRef,
          canonicalStatus: (simulateFailure ? 'FAILED_SYNC' : 'SUBMITTED') as any,
          statusMessage: simulateFailure
            ? 'Pending synchronization: Service provider endpoint timed out.'
            : 'Application received and registered at central provider node.',
          source: service.provider,
          integrationType: service.integration_type,
          providerStatus: simulateFailure ? 'TIMEOUT' : 'RECEIVED'
        }
      };
    }

    const latencyMs = Date.now() - startMs;

    // 6. Record API Transaction Audit
    if (service.api_registry_id) {
      await prisma.aPITransaction.create({
        data: {
          trace_id: traceId,
          api_registry_id: service.api_registry_id,
          redacted_request_hash: `hash_${Date.now()}`,
          response_status: connectorRes.success ? 200 : 504,
          latency_ms: latencyMs,
          outcome: connectorRes.success ? 'SUCCESS' : 'TIMEOUT'
        }
      });
    }

    // 7. Store Application and Initial Status Timeline
    const application = await prisma.serviceApplication.create({
      data: {
        user_id: userId,
        service_id,
        external_ref: connectorRes.externalRef,
        canonical_status: connectorRes.normalized.canonicalStatus,
        consent_id: consentRecord.consent_id,
        idempotency_key,
        form_data: JSON.stringify(form_data || {}),
        statuses: {
          create: [
            {
              canonical_status: connectorRes.normalized.canonicalStatus,
              provider_status: connectorRes.providerStatus,
              source: connectorRes.normalized.source,
              message: connectorRes.normalized.statusMessage
            }
          ]
        }
      },
      include: {
        service: true,
        statuses: true,
        consent: true
      }
    });

    // 8. Create In-App Notification
    await prisma.notification.create({
      data: {
        user_id: userId,
        type: connectorRes.success ? 'SUCCESS' : 'WARNING',
        title: connectorRes.success ? 'Application Submitted' : 'Pending Synchronization',
        message: `Application reference ${connectorRes.externalRef} for ${service.name} has been processed: ${connectorRes.normalized.statusMessage}`
      }
    });

    // 9. Write Audit Log
    await logAuditEvent(`user:${userId}`, 'APPLICATION_SUBMITTED', `application:${application.application_id}`, traceId, {
      external_ref: connectorRes.externalRef,
      canonical_status: connectorRes.normalized.canonicalStatus,
      integration_type: service.integration_type
    });

    return res.status(201).json({
      message: 'Application processed through SETU interoperability gateway',
      traceId,
      application
    });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const getApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return sendStandardError(res, 401, 'UNAUTHORIZED', 'Not authenticated');

    const applications = await prisma.serviceApplication.findMany({
      where: { user_id: userId },
      include: {
        service: {
          include: { api_registry: true }
        },
        statuses: {
          orderBy: { created_at: 'asc' }
        },
        consent: true
      },
      orderBy: { created_at: 'desc' }
    });

    return res.json({ applications });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const application = await prisma.serviceApplication.findUnique({
      where: { application_id: id },
      include: {
        service: { include: { api_registry: true } },
        statuses: { orderBy: { created_at: 'asc' } },
        consent: true
      }
    });

    if (!application) {
      return sendStandardError(res, 404, 'NOT_FOUND', 'Application not found');
    }

    return res.json({ application });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const trackByReference = async (req: AuthRequest, res: Response) => {
  try {
    const ref = (req.query.ref as string) || (req.params.ref as string);

    if (!ref) {
      return sendStandardError(res, 400, 'VALIDATION_ERROR', 'Application reference number is required');
    }

    const application = await prisma.serviceApplication.findFirst({
      where: { external_ref: ref.trim() },
      include: {
        service: true,
        statuses: { orderBy: { created_at: 'asc' } }
      }
    });

    if (!application) {
      return sendStandardError(res, 404, 'NOT_FOUND', `No application found with reference number "${ref}"`);
    }

    return res.json({ application });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const refreshStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const application = await prisma.serviceApplication.findUnique({
      where: { application_id: id },
      include: { service: { include: { api_registry: true } } }
    });

    if (!application) {
      return sendStandardError(res, 404, 'NOT_FOUND', 'Application not found');
    }

    // Advance status from SUBMITTED -> UNDER_REVIEW -> APPROVED
    let nextCanonical = application.canonical_status;
    let nextProviderStatus = 'IN_PROCESS';
    let msg = 'Live provider update received.';

    if (application.canonical_status === 'FAILED_SYNC') {
      nextCanonical = 'SUBMITTED';
      nextProviderStatus = 'RECEIVED';
      msg = 'Re-synchronized successfully with endpoint.';
    } else if (application.canonical_status === 'SUBMITTED') {
      nextCanonical = 'UNDER_REVIEW';
      nextProviderStatus = 'PENDING_TAHSILDAR';
      msg = 'Provider updated status: Application assigned to officer review.';
    } else if (application.canonical_status === 'UNDER_REVIEW') {
      nextCanonical = 'APPROVED';
      nextProviderStatus = 'SANCTIONED';
      msg = 'Provider updated status: Application sanctioned successfully.';
    }

    const newStatusEntry = await prisma.applicationStatus.create({
      data: {
        application_id: id,
        canonical_status: nextCanonical,
        provider_status: nextProviderStatus,
        source: application.service.provider,
        message: msg
      }
    });

    const updatedApp = await prisma.serviceApplication.update({
      where: { application_id: id },
      data: { canonical_status: nextCanonical },
      include: {
        service: true,
        statuses: { orderBy: { created_at: 'asc' } }
      }
    });

    return res.json({
      message: 'Application status re-synchronized with provider',
      status: newStatusEntry,
      application: updatedApp
    });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};
