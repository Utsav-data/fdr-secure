import { Request, Response } from 'express';
import { query } from '../db/index';
import { initiateConsentRequest } from '../services/setu.service';

/**
 * Account Aggregator (Setu) Webhook Receiver
 *
 * Receives asynchronous callback from Setu when institutional signatory grants consent.
 * Updates FDR records:
 * - sets verification_source to 'ACCOUNT_AGGREGATOR'
 * - sets status to 'ACTIVE'
 * - sets lien_active to true
 */
export const handleSetuWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body || {};
    const consent_id =
      payload.consent_id ||
      payload.consentId ||
      payload.data?.consentId ||
      (req.query.consent_id as string);

    if (!consent_id) {
      res.status(400).json({
        success: false,
        message: 'Invalid webhook payload: consent_id is required.',
      });
      return;
    }

    console.log(`[Setu Webhook] Received Account Aggregator consent callback for consent_id: ${consent_id}`);

    // 1. Update Consent_Artifacts status to ACTIVE if table has this consent
    try {
      await query(
        `UPDATE Consent_Artifacts
         SET status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP
         WHERE consent_id = $1`,
        [consent_id]
      );
    } catch (err: any) {
      console.warn('[Setu Webhook] Consent_Artifacts update notice:', err.message);
    }

    // 2. Update FDR_Records table:
    // Sets verification_source = 'ACCOUNT_AGGREGATOR', status = 'ACTIVE', lien_active = TRUE
    const updateSql = `
      UPDATE FDR_Records
      SET 
        verification_source = 'ACCOUNT_AGGREGATOR',
        status = 'ACTIVE',
        lien_active = TRUE,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        consent_id = $1 
        OR institution_id IN (
          SELECT institution_id FROM Consent_Artifacts WHERE consent_id = $1
        )
      RETURNING *;
    `;

    const result = await query(updateSql, [consent_id]);

    console.log(
      `[Setu Webhook] Successfully verified and activated ${result.rows.length} FDR record(s) under consent ${consent_id}`
    );

    res.status(200).json({
      success: true,
      message: 'Account Aggregator webhook processed successfully. FDR verification complete.',
      consent_id,
      verified_records_count: result.rows.length,
      data: result.rows,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Setu Webhook] Error processing AA callback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process Account Aggregator webhook callback.',
      error: error.message,
    });
  }
};

/**
 * Controller to initiate a new AA consent request (used by frontends or institutional admins)
 */
export const initiateConsent = async (req: Request, res: Response): Promise<void> => {
  try {
    const institution_id =
      req.body.institution_id ||
      req.user?.institution_id ||
      '00000000-0000-0000-0000-000000000001';

    const consentData = await initiateConsentRequest(institution_id);

    res.status(201).json({
      success: true,
      message: 'Account Aggregator consent request initiated.',
      data: consentData,
    });
  } catch (error: any) {
    console.error('[Setu Webhook Controller] Error initiating consent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate consent request.',
      error: error.message,
    });
  }
};

export default {
  handleSetuWebhook,
  initiateConsent,
};
