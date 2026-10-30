import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Format a Date object or date string into YYYY-MM-DD format consistently,
 * preventing any timezone boundary off-by-one shifts.
 */
export const formatDateKey = (date: Date | string): string => {
  if (typeof date === 'string') {
    const match = date.match(/^\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Generate a SHA-256 HMAC cryptographic time-lock hash for an FDR.
 * Formula: HMAC-SHA256(fdrId:maturityDate, salt)
 *
 * @param fdrId Unique UUID of the FDR record
 * @param maturityDate Maturity date of the FDR
 * @returns Hex-encoded SHA-256 HMAC cryptographic signature
 */
export const generateLockHash = (fdrId: string, maturityDate: Date): string => {
  const salt = process.env.CRYPTO_SECRET_SALT || 'aicte_fdr_zero_trust_salt_2026';
  const dateStr = formatDateKey(maturityDate);
  const payload = `${fdrId}:${dateStr}`;
  return crypto.createHmac('sha256', salt).update(payload).digest('hex');
};

/**
 * Recalculate and verify if the stored lock hash matches the expected cryptographic HMAC.
 * Uses timingSafeEqual to protect against side-channel timing analysis.
 *
 * @param fdrId Unique UUID of the FDR record
 * @param maturityDate Maturity date from the database row
 * @param storedHash The cryptographic_lock_hash retrieved from the database
 * @returns boolean indicating whether the hash is valid and untampered
 */
export const verifyLockHash = (
  fdrId: string,
  maturityDate: Date | string,
  storedHash: string
): boolean => {
  if (!storedHash) return false;
  const d = maturityDate instanceof Date ? maturityDate : new Date(maturityDate);
  const expectedHash = generateLockHash(fdrId, d);

  if (storedHash.length !== expectedHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(storedHash, 'utf-8'),
    Buffer.from(expectedHash, 'utf-8')
  );
};

export default {
  generateLockHash,
  verifyLockHash,
  formatDateKey,
};
