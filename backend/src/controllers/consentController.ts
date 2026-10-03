import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';
import { sendStandardError } from '../utils/helpers';
import { logAuditEvent } from '../middlewares/auditMiddleware';

const prisma = new PrismaClient();

export const grantConsent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const { recipient_service_id, purpose, requested_fields, expiry_days = 90 } = req.body;

    if (!userId || !recipient_service_id || !purpose || !requested_fields) {
      return sendStandardError(res, 400, 'VALIDATION_ERROR', 'Missing required consent parameters');
    }

    const service = await prisma.governmentService.findUnique({
      where: { service_id: recipient_service_id }
    });

    if (!service) {
      return sendStandardError(res, 404, 'NOT_FOUND', 'Recipient service not found');
    }

    const expiresAt = new Date(Date.now() + (expiry_days * 24 * 60 * 60 * 1000));
    const fieldsJson = typeof requested_fields === 'string' ? requested_fields : JSON.stringify(requested_fields);

    const consent = await prisma.consentRecord.create({
      data: {
        user_id: userId,
        recipient_service_id,
        purpose,
        requested_fields: fieldsJson,
        status: 'GRANTED',
        expires_at: expiresAt
      },
      include: { service: true }
    });

    const traceId = (res.getHeader('X-Trace-Id') as string) || 'tr-consent';
    await logAuditEvent(`user:${userId}`, 'CONSENT_GRANTED', `consent:${consent.consent_id}`, traceId, {
      recipient: service.name,
      purpose,
      requested_fields
    });

    return res.status(201).json({
      message: 'Explicit consent granted successfully',
      consent
    });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const getConsents = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return sendStandardError(res, 401, 'UNAUTHORIZED', 'Not authenticated');

    const consents = await prisma.consentRecord.findMany({
      where: { user_id: userId },
      include: {
        service: true,
        applications: {
          select: {
            application_id: true,
            external_ref: true,
            canonical_status: true,
            created_at: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return res.json({ consents });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const revokeConsent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const { id } = req.params;

    if (!userId) return sendStandardError(res, 401, 'UNAUTHORIZED', 'Not authenticated');

    const existingConsent = await prisma.consentRecord.findFirst({
      where: { consent_id: id, user_id: userId }
    });

    if (!existingConsent) {
      return sendStandardError(res, 404, 'NOT_FOUND', 'Consent record not found');
    }

    const updatedConsent = await prisma.consentRecord.update({
      where: { consent_id: id },
      data: { status: 'REVOKED' },
      include: { service: true }
    });

    const traceId = (res.getHeader('X-Trace-Id') as string) || 'tr-revoke';
    await logAuditEvent(`user:${userId}`, 'CONSENT_REVOKED', `consent:${id}`, traceId, {
      recipient: updatedConsent.service.name
    });

    return res.json({
      message: 'Consent revoked successfully. Future gateway access for this service is blocked.',
      consent: updatedConsent
    });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};
