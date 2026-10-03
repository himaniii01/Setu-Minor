import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendStandardError } from '../utils/helpers';

export interface AuthRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendStandardError(res, 401, 'UNAUTHORIZED', 'Authentication token required');
  }

  try {
    const secret = process.env.JWT_SECRET || 'setu_secret_jwt_key_2026_academic_prototype';
    const decoded = jwt.verify(token, secret) as any;
    req.user = {
      user_id: decoded.user_id,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (err) {
    return sendStandardError(res, 403, 'FORBIDDEN', 'Invalid or expired access token');
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendStandardError(
        res,
        403,
        'FORBIDDEN',
        `Access restricted to roles: ${roles.join(', ')}`
      );
    }
    next();
  };
};
