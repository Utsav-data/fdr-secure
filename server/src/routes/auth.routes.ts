import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user by email and return JWT token
 * @access  Public
 */
router.post('/login', login);

export default router;
