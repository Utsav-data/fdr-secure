import { Request, Response } from 'express';
import crypto from 'crypto';
import { query } from '../db/index';
import {
  generateLockHash,
  verifyLockHash,
  formatDateKey,
} from '../services/crypto.service';

// Allowed statuses based on schema constraints and workflow
const VALID_STATUSES = [
  'PENDING',
  'PENDING_VERIFICATION',
  'ACTIVE',
  'FLAGGED',
  'VERIFIED',
  'EXPIRED',
  'LIEN_MARKED',
  'REJECTED',
  'RELEASED',
  'RENEWAL_REQUIRED',
];

/**
 * Create a new FDR record manually submitted by an institution.
 * Sets status to 'PENDING_VERIFICATION' and verification_source to 'MANUAL'.
 */
export const createFDR = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required to submit an FDR.',
      });
      return;
    }

    const {
      fdr_number,
      bank_name,
      amount,
      issue_date,
      maturity_date,
      lien_active = true,
      cryptographic_lock_hash,
    } = req.body;

    // Resolve target institution_id
    // If institution_admin, force using their assigned institution_id
    // If aicte_admin, allow specifying institution_id in the body
    let institution_id = user.institution_id;
    if (user.role === 'aicte_admin' && req.body.institution_id) {
      institution_id = req.body.institution_id;
    }

    if (!institution_id) {
      res.status(400).json({
        success: false,
        message: 'Institution ID is required. Your user account must be linked to an institution, or an institution_id must be provided.',
      });
      return;
    }

    // Input Validation
    if (!fdr_number || !bank_name || amount === undefined || !issue_date || !maturity_date) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: fdr_number, bank_name, amount, issue_date, and maturity_date are all required.',
      });
      return;
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid amount. Amount must be a positive number.',
      });
      return;
    }

    const parsedIssueDate = new Date(issue_date);
    const parsedMaturityDate = new Date(maturity_date);

    if (isNaN(parsedIssueDate.getTime()) || isNaN(parsedMaturityDate.getTime())) {
      res.status(400).json({
        success: false,
        message: 'Invalid date format. Please supply valid ISO date strings (e.g. YYYY-MM-DD).',
      });
      return;
    }

    if (parsedMaturityDate < parsedIssueDate) {
      res.status(400).json({
        success: false,
        message: 'Maturity date cannot be earlier than issue date.',
      });
      return;
    }

    // Verify institution exists in database
    const instCheck = await query('SELECT id, name FROM Institutions WHERE id = $1', [institution_id]);
    if (instCheck.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: `Institution with ID '${institution_id}' was not found.`,
      });
      return;
    }

    // Generate UUID and SHA-256 HMAC Cryptographic Time-Lock Hash
    const fdrId = crypto.randomUUID();
    const lockHash = generateLockHash(fdrId, parsedMaturityDate);

    const insertSql = `
      INSERT INTO FDR_Records (
        id,
        institution_id,
        fdr_number,
        bank_name,
        amount,
        issue_date,
        maturity_date,
        status,
        verification_source,
        lien_active,
        cryptographic_lock_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING_VERIFICATION', 'MANUAL', $8, $9)
      RETURNING *;
    `;

    const values = [
      fdrId,
      institution_id,
      String(fdr_number).trim(),
      String(bank_name).trim(),
      parsedAmount,
      issue_date,
      maturity_date,
      Boolean(lien_active),
      lockHash,
    ];

    const result = await query(insertSql, values);
    const newFDR = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'FDR record successfully submitted for verification.',
      data: newFDR,
    });
  } catch (error: any) {
    // Check for PostgreSQL unique constraint violation (code 23505)
    if (error.code === '23505') {
      res.status(409).json({
        success: false,
        message: 'An FDR record with this FDR number already exists in the system.',
      });
      return;
    }

    console.error('[FDRController.createFDR] Error inserting FDR record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create FDR record.',
      error: error.message,
    });
  }
};

/**
 * Fetch FDR records.
 * If user role is 'institution_admin', returns only FDRs for their specific institution.
 * If user role is 'aicte_admin', returns all FDR records across all institutions.
 */
export const getFDRs = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required.',
      });
      return;
    }

    const { status, search, institution_id } = req.query;

    let baseSql = `
      SELECT 
        f.id,
        f.institution_id,
        i.name AS institution_name,
        i.aicte_id AS institution_aicte_id,
        f.fdr_number,
        f.bank_name,
        f.amount,
        f.issue_date,
        f.maturity_date,
        f.status,
        f.verification_source,
        f.lien_active,
        f.cryptographic_lock_hash,
        f.created_at,
        f.updated_at
      FROM FDR_Records f
      LEFT JOIN Institutions i ON f.institution_id = i.id
    `;

    const conditions: string[] = [];
    const params: any[] = [];

    // Role-based filtering
    if (user.role === 'institution_admin') {
      if (!user.institution_id) {
        res.status(403).json({
          success: false,
          message: 'Access forbidden: Institution administrator has no associated institution ID.',
        });
        return;
      }
      params.push(user.institution_id);
      conditions.push(`f.institution_id = $${params.length}`);
    } else if (user.role === 'aicte_admin') {
      // AICTE Admin can see all, but can optionally filter by institution_id query param
      if (institution_id) {
        params.push(institution_id);
        conditions.push(`f.institution_id = $${params.length}`);
      }
    } else {
      // Other roles (e.g., finance_officer, auditor)
      if (user.institution_id) {
        params.push(user.institution_id);
        conditions.push(`f.institution_id = $${params.length}`);
      }
    }

    // Optional status filter
    if (status && typeof status === 'string') {
      params.push(status.toUpperCase());
      conditions.push(`UPPER(f.status) = $${params.length}`);
    }

    // Optional keyword search (FDR number, bank name, institution name)
    if (search && typeof search === 'string') {
      params.push(`%${search.trim()}%`);
      conditions.push(`(
        f.fdr_number ILIKE $${params.length} 
        OR f.bank_name ILIKE $${params.length}
        OR i.name ILIKE $${params.length}
        OR i.aicte_id ILIKE $${params.length}
      )`);
    }

    if (conditions.length > 0) {
      baseSql += ` WHERE ` + conditions.join(' AND ');
    }

    baseSql += ` ORDER BY f.created_at DESC;`;

    const result = await query(baseSql, params);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error: any) {
    console.error('[FDRController.getFDRs] Error querying FDR records:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve FDR records.',
      error: error.message,
    });
  }
};

/**
 * Fetch a single FDR record by ID.
 * Respects institution boundary for institution_admin.
 */
export const getFDRById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required.',
      });
      return;
    }

    const sql = `
      SELECT 
        f.id,
        f.institution_id,
        i.name AS institution_name,
        i.aicte_id AS institution_aicte_id,
        f.fdr_number,
        f.bank_name,
        f.amount,
        f.issue_date,
        f.maturity_date,
        f.status,
        f.verification_source,
        f.lien_active,
        f.cryptographic_lock_hash,
        f.created_at,
        f.updated_at
      FROM FDR_Records f
      LEFT JOIN Institutions i ON f.institution_id = i.id
      WHERE f.id = $1
      LIMIT 1;
    `;

    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: `FDR record with ID '${id}' not found.`,
      });
      return;
    }

    const record = result.rows[0];

    // Boundary check for institution_admin
    if (user.role === 'institution_admin' && record.institution_id !== user.institution_id) {
      res.status(403).json({
        success: false,
        message: 'Access forbidden: You cannot view FDR records belonging to other institutions.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error: any) {
    console.error('[FDRController.getFDRById] Error querying single FDR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve FDR record.',
      error: error.message,
    });
  }
};

/**
 * Update an FDR's status.
 * Restricted strictly to AICTE admins.
 * Allowed statuses include: ACTIVE, FLAGGED, RELEASED, VERIFIED, REJECTED, etc.
 */
export const updateFDRStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required.',
      });
      return;
    }

    // Role check: Only aicte_admin can change status
    if (user.role !== 'aicte_admin') {
      res.status(403).json({
        success: false,
        message: 'Access forbidden: Only AICTE administrators are authorized to update FDR status.',
      });
      return;
    }

    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!status) {
      res.status(400).json({
        success: false,
        message: `Status is required. Valid statuses are: ${VALID_STATUSES.join(', ')}`,
      });
      return;
    }

    const formattedStatus = String(status).trim().toUpperCase();

    if (!VALID_STATUSES.includes(formattedStatus)) {
      res.status(400).json({
        success: false,
        message: `Invalid status '${status}'. Allowed values are: ${VALID_STATUSES.join(', ')}`,
      });
      return;
    }

    // Fetch existing FDR row from DB
    const existingCheck = await query('SELECT * FROM FDR_Records WHERE id = $1', [id]);
    if (existingCheck.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: `FDR record with ID '${id}' was not found.`,
      });
      return;
    }

    const currentFDR = existingCheck.rows[0];

    // Zero-Trust Time-Lock Security Verification when status transition is 'RELEASED'
    if (formattedStatus === 'RELEASED') {
      // 1. Recalculate hash from DB row and check if it matches stored cryptographic_lock_hash
      const isHashValid = verifyLockHash(
        currentFDR.id,
        currentFDR.maturity_date,
        currentFDR.cryptographic_lock_hash
      );

      if (!isHashValid) {
        res.status(403).json({
          success: false,
          error: 'SECURITY_BREACH',
          message: 'Security Breach: Cryptographic Time-Lock validation failed! Stored SHA-256 seal does not match the immutable record parameters.',
        });
        return;
      }

      // 2. Check if current date >= maturity_date
      const todayStr = formatDateKey(new Date());
      const maturityStr = formatDateKey(currentFDR.maturity_date);

      if (todayStr < maturityStr) {
        res.status(403).json({
          success: false,
          error: 'SECURITY_BREACH',
          message: `Security Breach: Cannot release FDR before statutory maturity date (${maturityStr}). Current date is ${todayStr}. Early encashment or premature lien release is prohibited by Zero-Trust policy.`,
        });
        return;
      }
    }

    const updateSql = `
      UPDATE FDR_Records
      SET 
        status = $1,
        lien_active = CASE WHEN $1 = 'RELEASED' THEN FALSE ELSE lien_active END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;

    const result = await query(updateSql, [formattedStatus, id]);
    const updatedFDR = result.rows[0];

    res.status(200).json({
      success: true,
      message: `FDR status successfully updated to '${formattedStatus}'.`,
      data: updatedFDR,
      remarks: remarks || null,
    });
  } catch (error: any) {
    console.error('[FDRController.updateFDRStatus] Error updating FDR status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update FDR status.',
      error: error.message,
    });
  }
};

export default {
  createFDR,
  getFDRs,
  getFDRById,
  updateFDRStatus,
};
