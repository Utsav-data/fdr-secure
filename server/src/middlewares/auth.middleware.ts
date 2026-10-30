import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthUserPayload {
  id: string;
  role: 'aicte_admin' | 'institution_admin' | 'finance_officer' | 'auditor' | string;
  institution_id?: string | null;
  email?: string;
  iat?: number;
  exp?: number;
}

// Extend standard Express Request to include user payload
declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: AuthUserPayload;
}

/**
 * Express middleware to verify incoming JWT bearer token and attach decoded user to Request
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization || (req.headers['authorization'] as string);

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No authorization header provided.',
      });
      return;
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Bearer token missing from authorization header.',
      });
      return;
    }

    const secret = process.env.JWT_SECRET || 'aicte_super_secret_jwt_key_2026_resonance_production';

    const decoded = jwt.verify(token, secret) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Authentication token has expired. Please log in again.',
      });
      return;
    }

    res.status(403).json({
      success: false,
      message: 'Invalid or malformed authentication token.',
      error: error.message,
    });
  }
};

/**
 * Role-based authorization middleware guard
 * @param allowedRoles Allowed roles string list
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required prior to permission verification.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource. Required: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
};
