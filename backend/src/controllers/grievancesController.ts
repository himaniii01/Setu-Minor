import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';
import { sendStandardError } from '../utils/helpers';
import { logAuditEvent } from '../middlewares/auditMiddleware';

export const lodgeGrievance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return sendStandardError(res, 401, 'UNAUTHORIZED', 'Not authenticated');

    const { department, subject, description, district_area, urgency = 'NORMAL' } = req.body;

    if (!department || !subject || !description || !district_area) {
      return sendStandardError(res, 400, 'VALIDATION_ERROR', 'All required grievance fields must be completed');
    }

    const randomRef = `GRV-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const grievance = await prisma.grievance.create({
      data: {
        user_id: userId,
        department,
        subject,
        description,
        district_area,
        urgency,
        reference_no: randomRef
      }
    });

    const traceId = (res.getHeader('X-Trace-Id') as string) || 'tr-grv';
    await logAuditEvent(`user:${userId}`, 'GRIEVANCE_LODGED', `grievance:${grievance.grievance_id}`, traceId, {
      reference_no: randomRef,
      department
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        user_id: userId,
        type: 'INFO',
        title: 'Grievance Registered',
        message: `Your grievance (${randomRef}) regarding "${subject}" has been registered with ${department}. SLA target: 7 Days.`
      }
    });

    return res.status(201).json({
      message: 'Citizen grievance registered successfully',
      reference_no: randomRef,
      grievance
    });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const getGrievances = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return sendStandardError(res, 401, 'UNAUTHORIZED', 'Not authenticated');

    const grievances = await prisma.grievance.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    return res.json({ grievances });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};
