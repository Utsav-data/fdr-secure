import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db/index';

/**
 * Handle user login for prototype authentication.
 * Validates email against the Users table and returns a signed JWT.
 * In this prototype phase, password hashing check is bypassed as per requirements.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required fields.',
      });
      return;
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    // Query user by email
    const sql = `
      SELECT id, email, role, institution_id, created_at
      FROM Users
      WHERE LOWER(email) = $1
      LIMIT 1;
    `;
    const result = await query(sql, [trimmedEmail]);

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. User with specified email does not exist.',
      });
      return;
    }

    const user = result.rows[0];
    const jwtSecret = process.env.JWT_SECRET || 'aicte_super_secret_jwt_key_2026_resonance_production';

    // Construct token payload
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      institution_id: user.institution_id || null,
    };

    const token = jwt.sign(tokenPayload, jwtSecret, {
      expiresIn: '24h',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        institution_id: user.institution_id || null,
      },
    });
  } catch (error: any) {
    console.error('[AuthController.login] Error occurred during login:', error);
    res.status(500).json({
      success: false,
      message: 'An internal server error occurred while processing authentication.',
      error: error.message,
    });
  }
};

export default {
  login,
};
