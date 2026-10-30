import { Router } from 'express';
import {
  createRegulation,
  getPendingTasks,
  submitComplianceFeedback,
} from '../controllers/regulation.controller';
import { verifyToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Apply JWT verification middleware to all regulation routes
router.use(verifyToken);

/**
 * @route   POST /api/regulations
 * @desc    Promulgate a new regulation and dispatch tasks to targeted institutions
 * @access  Protected (aicte_admin only)
 */
router.post('/', requireRole('aicte_admin'), createRegulation);

/**
 * @route   GET /api/regulations/tasks
 * @desc    Fetch pending or under-review compliance tasks for the institution
 * @access  Protected (institution_admin, aicte_admin, etc.)
 */
router.get('/tasks', getPendingTasks);

/**
 * @route   POST /api/regulations/tasks/:id/submit
 * @desc    Submit institutional compliance feedback and top-up FDR link
 * @access  Protected (institution_admin, finance_officer)
 */
router.post('/tasks/:id/submit', submitComplianceFeedback);
router.put('/tasks/:id/submit', submitComplianceFeedback);
router.patch('/tasks/:id/submit', submitComplianceFeedback);

export default router;
