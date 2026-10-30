import cron, { ScheduledTask } from 'node-cron';
import { query } from '../db/index';

export interface ExpiringFDR {
  id: string;
  fdr_number: string;
  bank_name: string;
  amount: number | string;
  maturity_date: string;
  status: string;
  institution_id: string;
  institution_name?: string;
  institution_aicte_id?: string;
  days_remaining: number;
}

/**
 * Core maturity check function.
 * Queries FDRs where maturity_date is within the next 30 days and status is 'ACTIVE'.
 * Logs a warning (simulating institutional email/SMS alert).
 * If within 5 days of expiry, updates status to 'RENEWAL_REQUIRED'.
 */
export const checkFDRMaturity = async (): Promise<ExpiringFDR[]> => {
  console.log('[Maturity Cron Job] Running daily statutory FDR maturity inspection...');
  try {
    const sql = `
      SELECT 
        f.id,
        f.fdr_number,
        f.bank_name,
        f.amount,
        f.maturity_date,
        f.status,
        f.institution_id,
        i.name AS institution_name,
        i.aicte_id AS institution_aicte_id,
        (f.maturity_date - CURRENT_DATE) AS days_remaining
      FROM FDR_Records f
      LEFT JOIN Institutions i ON f.institution_id = i.id
      WHERE f.status = 'ACTIVE'
        AND f.maturity_date >= CURRENT_DATE
        AND f.maturity_date <= CURRENT_DATE + INTERVAL '30 days'
      ORDER BY f.maturity_date ASC;
    `;

    const result = await query(sql);
    const expiringFDRs: ExpiringFDR[] = result.rows;

    if (expiringFDRs.length === 0) {
      console.log('[Maturity Cron Job] ✓ Zero active FDR records expiring within the 30-day monitoring window.');
      return [];
    }

    console.log(
      `[Maturity Cron Job] Found ${expiringFDRs.length} active FDR record(s) maturing within 30 days.`
    );

    for (const fdr of expiringFDRs) {
      const daysRemaining = Math.max(0, Number(fdr.days_remaining));
      const formattedAmount = Number(fdr.amount).toLocaleString('en-IN');
      const institutionDisplay = fdr.institution_name
        ? `${fdr.institution_name} (${fdr.institution_aicte_id || 'ID N/A'})`
        : `Institution ID: ${fdr.institution_id}`;

      // 1. Log simulated Email / SMS alert to the institution
      console.warn(
        `[⚠️ AICTE STATUTORY ALERT - 30-DAY WINDOW]: Institution: ${institutionDisplay} | FDR #${fdr.fdr_number} (${fdr.bank_name}, ₹${formattedAmount}) matures in ${daysRemaining} day(s) on ${fdr.maturity_date}. Dispatching automated reminder notification to Finance Officer.`
      );

      // 2. If within 5 days of expiry, update DB to flag as 'RENEWAL_REQUIRED'
      if (daysRemaining <= 5) {
        console.warn(
          `[🚨 CRITICAL COMPLIANCE NOTICE]: FDR #${fdr.fdr_number} has reached the 5-day expiration threshold (${daysRemaining} days left). Updating database status to 'RENEWAL_REQUIRED'.`
        );

        await query(
          `UPDATE FDR_Records 
           SET status = 'RENEWAL_REQUIRED', updated_at = CURRENT_TIMESTAMP 
           WHERE id = $1;`,
          [fdr.id]
        );
      }
    }

    return expiringFDRs;
  } catch (error: any) {
    console.error('[Maturity Cron Job Error]:', error.message);
    return [];
  }
};

/**
 * Initializes the automated node-cron schedule to run daily at midnight ('0 0 * * *').
 */
export const initMaturityCron = (): ScheduledTask => {
  console.log('[Maturity Cron Job] Initializing daily midnight scheduler (Schedule: 0 0 * * *)...');
  const task = cron.schedule('0 0 * * *', async () => {
    await checkFDRMaturity();
  });
  return task;
};

export default {
  initMaturityCron,
  checkFDRMaturity,
};
