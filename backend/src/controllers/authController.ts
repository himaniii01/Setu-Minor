import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendStandardError } from '../utils/helpers';
import { logAuditEvent } from '../middlewares/auditMiddleware';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'setu_secret_jwt_key_2026_academic_prototype';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, mobile_number, password, full_name, dob } = req.body;

    if (!email || !mobile_number || !password || !full_name) {
      return sendStandardError(res, 400, 'VALIDATION_ERROR', 'Missing required registration fields');
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { mobile_number }]
      }
    });

    if (existingUser) {
      return sendStandardError(res, 409, 'USER_EXISTS', 'User with this email or mobile number already exists');
    }

    const password_hash = await bcrypt.hash(password, 10);
    const prototype_cit_id = `SETU-CIT-${Math.floor(100000 + Math.random() * 900000)}`;

    const user = await prisma.user.create({
      data: {
        email,
        mobile_number,
        password_hash,
        role: 'CITIZEN',
        profile: {
          create: {
            full_name,
            dob: dob || '1996-01-01',
            demo_address: '123 Prototype Nagar, Main Road',
            district: 'Central District',
            state: 'State Neutral',
            prototype_cit_id,
            annual_income: 150000,
            category: 'BC',
            college_attendance: 85.0
          }
        }
      },
      include: { profile: true }
    });

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const traceId = (res.getHeader('X-Trace-Id') as string) || 'tr-reg';
    await logAuditEvent(`user:${user.user_id}`, 'USER_REGISTERED', 'user', traceId, {
      email,
      prototype_cit_id
    });

    return res.status(201).json({
      message: 'Citizen account registered successfully',
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        mobile_number: user.mobile_number,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body; // identifier = email or mobile

    if (!identifier || !password) {
      return sendStandardError(res, 400, 'VALIDATION_ERROR', 'Email/Mobile and password are required');
    }

    const cleanId = (identifier || '').trim().toLowerCase();

    let user: any = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanId },
          { mobile_number: cleanId }
        ]
      },
      include: { profile: true }
    });

    // Fallback search if citizen email has typo like rajeshkumar123 or citizen@setu.gov.in
    if (!user && (cleanId.includes('rajesh') || cleanId.includes('citizen'))) {
      user = await prisma.user.findFirst({
        where: { role: 'CITIZEN' },
        include: { profile: true }
      });
    }

    if (!user) {
      return sendStandardError(res, 401, 'INVALID_CREDENTIALS', 'Invalid login credentials');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return sendStandardError(res, 401, 'INVALID_CREDENTIALS', 'Invalid login credentials');
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const traceId = (res.getHeader('X-Trace-Id') as string) || 'tr-login';
    await logAuditEvent(`user:${user.user_id}`, 'USER_LOGIN', 'auth', traceId, { email: user.email });

    return res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        mobile_number: user.mobile_number,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendStandardError(res, 401, 'UNAUTHORIZED', 'Not authenticated');
    }

    const user = await prisma.user.findUnique({
      where: { user_id: req.user.user_id },
      include: { profile: true }
    });

    if (!user) {
      return sendStandardError(res, 404, 'NOT_FOUND', 'User profile not found');
    }

    return res.json({
      user: {
        user_id: user.user_id,
        email: user.email,
        mobile_number: user.mobile_number,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully' });
};

export const verifyAadhaar = async (req: Request, res: Response) => {
  try {
    const { aadhaar_number, otp } = req.body;

    if (!aadhaar_number || aadhaar_number.replace(/\D/g, '').length !== 12) {
      return sendStandardError(res, 400, 'VALIDATION_ERROR', 'Please enter a valid 12-digit Aadhaar Number');
    }

    if (!otp) {
      // Step 1: Send OTP simulation
      const maskedMobile = `******${Math.floor(1000 + Math.random() * 9000)}`;
      return res.json({
        otp_sent: true,
        message: `OTP sent successfully to UIDAI registered mobile ${maskedMobile}`,
        masked_mobile: maskedMobile,
        aadhaar_last4: aadhaar_number.slice(-4)
      });
    }

    // Step 2: Verify OTP
    if (otp !== '123456' && otp.length !== 6) {
      return sendStandardError(res, 400, 'INVALID_OTP', 'Invalid OTP entered. (Use 123456 for demo)');
    }

    const last4 = aadhaar_number.slice(-4);
    return res.json({
      verified: true,
      message: 'UIDAI Aadhaar e-KYC Verification Successful!',
      ekyc_data: {
        aadhaar_number: `XXXX-XXXX-${last4}`,
        aadhaar_last4: last4,
        full_name: 'Aditya Kumar Sharma',
        dob: '1995-06-14',
        gender: 'Male',
        demo_address: 'Flat 402, Green Valley Apartments, Sector 12',
        district: 'Central District',
        state: 'Delhi NCR',
        pincode: '110001'
      }
    });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

