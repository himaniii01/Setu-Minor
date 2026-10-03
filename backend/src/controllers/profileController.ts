import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';
import { sendStandardError } from '../utils/helpers';
import { logAuditEvent } from '../middlewares/auditMiddleware';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return sendStandardError(res, 401, 'UNAUTHORIZED', 'Not authenticated');

    const profile = await prisma.citizenProfile.findUnique({
      where: { user_id: userId },
      include: {
        user: {
          select: {
            email: true,
            mobile_number: true,
            role: true,
            created_at: true
          }
        }
      }
    });

    if (!profile) {
      return sendStandardError(res, 404, 'NOT_FOUND', 'Citizen profile not found');
    }

    return res.json({ profile });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return sendStandardError(res, 401, 'UNAUTHORIZED', 'Not authenticated');

    const { full_name, dob, gender, demo_address, district, state, annual_income, category, college_attendance } = req.body;

    const existing = await prisma.citizenProfile.findUnique({
      where: { user_id: userId }
    });

    if (!existing) {
      return sendStandardError(res, 404, 'NOT_FOUND', 'Citizen profile not found');
    }

    const updated = await prisma.citizenProfile.update({
      where: { user_id: userId },
      data: {
        ...(full_name && { full_name }),
        ...(dob && { dob }),
        ...(gender && { gender }),
        ...(demo_address && { demo_address }),
        ...(district && { district }),
        ...(state && { state }),
        ...(annual_income !== undefined && { annual_income: parseFloat(annual_income) }),
        ...(category && { category }),
        ...(college_attendance !== undefined && { college_attendance: parseFloat(college_attendance) }),
        version: existing.version + 1
      }
    });

    const traceId = (res.getHeader('X-Trace-Id') as string) || 'tr-prof-upd';
    await logAuditEvent(`user:${userId}`, 'PROFILE_UPDATED', `profile:${updated.profile_id}`, traceId, {
      version: updated.version
    });

    return res.json({
      message: 'Citizen profile updated successfully (Version incremented)',
      profile: updated
    });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};
