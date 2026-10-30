import { Router } from 'express';
import {
  handleSetuWebhook,
  initiateConsent,
} from '../controllers/webhook.controller';

const router = Router();

/**
 * Public Webhook Endpoints (Zero JWT required as incoming calls originate from external banking rails/Setu)
 *
 * @route   POST /api/webhooks
 * @route   POST /api/webhooks/setu
 * @desc    Receive Account Aggregator asynchronous verification callback
 * @access  Public (Signature-verified in production)
 */
router.post('/', handleSetuWebhook);
router.post('/setu', handleSetuWebhook);
router.post('/callback', handleSetuWebhook);

/**
 * @route   POST /api/webhooks/consent
 * @desc    Initiate AA consent flow
 * @access  Public
 */
router.post('/consent', initiateConsent);

export default router;
