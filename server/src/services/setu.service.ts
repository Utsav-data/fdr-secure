import crypto from 'crypto';
import { query } from '../db/index';

export interface ConsentRequestResult {
  success: boolean;
  consent_id: string;
  redirect_url: string;
  institution_id: string;
  status: 'REQUESTED' | 'ACTIVE';
  created_at: string;
}

/**
 * Initiate an Account Aggregator (Setu AA) consent flow for an institution.
 * Returns a unique consent_id and a mock redirect URL for the institutional signatory.
 *
 * @param institutionId AICTE Institution UUID
 */
export const initiateConsentRequest = async (
  institutionId: string
): Promise<ConsentRequestResult> => {
  const consent_id = `setu_consent_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
  const redirect_url = `https://setu.co/mock-consent?consent_id=${consent_id}&institution_id=${encodeURIComponent(
    institutionId
  )}`;

  // Record consent artifact into the database if the table is ready
  try {
    await query(
      `INSERT INTO Consent_Artifacts (institution_id, consent_id, status)
       VALUES ($1, $2, 'REQUESTED')
       ON CONFLICT (consent_id) DO NOTHING;`,
      [institutionId, consent_id]
    );
  } catch (err: any) {
    // Graceful logging if running in standalone sandbox
    console.warn('[SetuService] Consent_Artifacts logging notice:', err.message);
  }

  return {
    success: true,
    consent_id,
    redirect_url,
    institution_id: institutionId,
    status: 'REQUESTED',
    created_at: new Date().toISOString(),
  };
};

export default {
  initiateConsentRequest,
};
