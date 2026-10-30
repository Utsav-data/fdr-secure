import { Router } from 'express';
import {
  createFDR,
  getFDRs,
  getFDRById,
  updateFDRStatus,
} from '../controllers/fdr.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Apply JWT verification middleware to all FDR routes
router.use(verifyToken);

/**
 * @route   GET /api/fdr
 * @desc    Fetch FDRs (Scoped to institution for institution_admin; all records for aicte_admin)
 * @access  Protected (institution_admin, aicte_admin, finance_officer, auditor)
 */
router.get('/', getFDRs);

/**
 * @route   POST /api/fdr
 * @desc    Manually submit an FDR record (status defaults to PENDING_VERIFICATION)
 * @access  Protected
 */
router.post('/', createFDR);

/**
 * @route   GET /api/fdr/:id
 * @desc    Fetch detailed information for a single FDR record by UUID
 * @access  Protected
 */
router.get('/:id', getFDRById);

/**
 * @route   PATCH /api/fdr/:id/status
 * @desc    Update FDR status (e.g., ACTIVE, FLAGGED, RELEASED) - restricted to AICTE Admins
 * @access  Protected (aicte_admin only)
 */
router.patch('/:id/status', updateFDRStatus);

/**
 * @route   PUT /api/fdr/:id/status
 * @desc    HTTP PUT alias for updating FDR status
 * @access  Protected (aicte_admin only)
 */
router.put('/:id/status', updateFDRStatus);

export default router;
