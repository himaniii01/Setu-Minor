import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';
import { sendStandardError } from '../utils/helpers';
import { logAuditEvent } from '../middlewares/auditMiddleware';
import { fetchDigiLockerMockDocuments } from '../connectors';

export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return sendStandardError(res, 401, 'UNAUTHORIZED', 'Not authenticated');

    const documents = await prisma.document.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    return res.json({ documents });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const uploadMockDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return sendStandardError(res, 401, 'UNAUTHORIZED', 'Not authenticated');

    const { type, fileName = 'fictional_doc.pdf' } = req.body;
    if (!type) return sendStandardError(res, 400, 'VALIDATION_ERROR', 'Document type is required');

    const randomHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const mockStorageUri = `mock://vault/documents/${type.toLowerCase()}_${Date.now()}_${fileName}`;

    const document = await prisma.document.create({
      data: {
        user_id: userId,
        type,
        storage_uri: mockStorageUri,
        checksum: randomHash,
        verification_status: 'VERIFIED',
        expiry: '2028-12-31'
      }
    });

    const traceId = (res.getHeader('X-Trace-Id') as string) || 'tr-doc-up';
    await logAuditEvent(`user:${userId}`, 'DOCUMENT_UPLOADED', `document:${document.document_id}`, traceId, {
      type,
      storage_uri: mockStorageUri
    });

    return res.status(201).json({
      message: 'Fictional prototype document uploaded to private vault',
      document
    });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const { id } = req.params;
    if (!userId) return sendStandardError(res, 401, 'UNAUTHORIZED', 'Not authenticated');

    const doc = await prisma.document.findFirst({
      where: { document_id: id, user_id: userId }
    });

    if (!doc) return sendStandardError(res, 404, 'NOT_FOUND', 'Document not found');

    await prisma.document.delete({ where: { document_id: id } });

    return res.json({ message: 'Document removed from private vault' });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const getDigiLockerMockDocs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return sendStandardError(res, 401, 'UNAUTHORIZED', 'Not authenticated');

    const profile = await prisma.citizenProfile.findUnique({
      where: { user_id: userId }
    });

    const citId = profile?.prototype_cit_id || 'SETU-CIT-000123';
    const mockDocs = await fetchDigiLockerMockDocuments(citId);

    return res.json(mockDocs);
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};
