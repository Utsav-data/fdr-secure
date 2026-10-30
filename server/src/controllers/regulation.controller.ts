import { Request, Response } from 'express';
import { query } from '../db/index';

/**
 * AICTE Regulation & Compliance Controller
 * Implements Phase 4 Active Regulatory Engine:
 * - Promulgates statutory regulations & bulk dispatches compliance tasks
 * - Fetches pending / under review tasks for institutions
 * - Receives compliance feedback & supplementary deposit documents
 */

/**
 * Create a new statutory regulation and dynamically dispatch compliance tasks
 * to all matching institutions based on target_criteria (e.g. region).
 * Restricted to 'aicte_admin'.
 */
export const createRegulation = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'aicte_admin') {
      res.status(403).json({
        success: false,
        message: 'Access forbidden: Only AICTE administrators can promulgate new statutory regulations.',
      });
      return;
    }

    const { title, description, target_criteria = {} } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      res.status(400).json({
        success: false,
        message: 'Regulation title is required.',
      });
      return;
    }

    // Parse target region if specified
    const criteriaObj = typeof target_criteria === 'string' ? JSON.parse(target_criteria) : target_criteria;
    const rawRegion = criteriaObj?.region || criteriaObj?.target_region || criteriaObj?.targetRegion;
    const isWildcard = !rawRegion || ['ALL', '*', 'ANY', 'GLOBAL', 'PAN-INDIA'].includes(String(rawRegion).toUpperCase().trim());
    const filterRegion = isWildcard ? null : String(rawRegion).trim();

    // 1. Insert new regulation
    const insertRegulationSql = `
      INSERT INTO Regulations (title, description, target_criteria)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const regResult = await query(insertRegulationSql, [
      title.trim(),
      description ? description.trim() : null,
      JSON.stringify(criteriaObj),
    ]);

    const newRegulation = regResult.rows[0];

    // 2. Query target institutions and bulk insert Compliance_Tasks
    const bulkInsertTasksSql = `
      INSERT INTO Compliance_Tasks (institution_id, regulation_id, status)
      SELECT id, $1, 'PENDING'
      FROM Institutions
      WHERE ($2::text IS NULL OR LOWER(region) = LOWER($2::text))
      RETURNING id, institution_id;
    `;

    const tasksResult = await query(bulkInsertTasksSql, [
      newRegulation.id,
      filterRegion,
    ]);

    console.log(
      `[Regulatory Engine] Regulation '${newRegulation.title}' created (ID: ${newRegulation.id}). Dispatched ${tasksResult.rows.length} compliance task(s) to region '${filterRegion || 'ALL'}'.`
    );

    res.status(201).json({
      success: true,
      message: `Statutory regulation promulgated successfully. Compliance tasks dispatched to ${tasksResult.rows.length} institution(s).`,
      data: newRegulation,
      tasks_assigned_count: tasksResult.rows.length,
      target_region: filterRegion || 'ALL',
    });
  } catch (error: any) {
    console.error('[RegulationController.createRegulation] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create regulation and dispatch compliance tasks.',
      error: error.message,
    });
  }
};

/**
 * Fetch compliance tasks for the authenticated institution with status 'PENDING' or 'UNDER_REVIEW'.
 * Joined with the Regulations table to provide regulation title and description.
 */
export const getPendingTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required.',
      });
      return;
    }

    // Determine target institution scope:
    // If institution_admin, scope strictly to user.institution_id
    // If aicte_admin, allow viewing all or filtering by query param institution_id
    let targetInstitutionId: string | null = null;

    if (user.role === 'institution_admin') {
      targetInstitutionId = user.institution_id || null;
    } else if (user.role === 'aicte_admin') {
      targetInstitutionId = (req.query.institution_id as string) || null;
    } else {
      targetInstitutionId = user.institution_id || null;
    }

    const sql = `
      SELECT 
        ct.id AS task_id,
        ct.institution_id,
        ct.regulation_id,
        ct.status,
        ct.feedback_text,
        ct.document_url,
        ct.created_at,
        ct.updated_at,
        r.title AS regulation_title,
        r.description AS regulation_description,
        r.target_criteria,
        i.name AS institution_name,
        i.aicte_id AS institution_aicte_id,
        i.region AS institution_region
      FROM Compliance_Tasks ct
      JOIN Regulations r ON ct.regulation_id = r.id
      LEFT JOIN Institutions i ON ct.institution_id = i.id
      WHERE ct.status IN ('PENDING', 'UNDER_REVIEW')
        AND ($1::uuid IS NULL OR ct.institution_id = $1)
      ORDER BY ct.created_at DESC;
    `;

    const result = await query(sql, [targetInstitutionId]);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error: any) {
    console.error('[RegulationController.getPendingTasks] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve compliance tasks.',
      error: error.message,
    });
  }
};

/**
 * Submit institutional compliance feedback & supplementary FDR/document URL.
 * Updates the task status to 'UNDER_REVIEW'.
 */
export const submitComplianceFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required.',
      });
      return;
    }

    const { id } = req.params;
    const { feedback_text, document_url } = req.body;

    if (!feedback_text && !document_url) {
      res.status(400).json({
        success: false,
        message: 'At least feedback_text or document_url must be provided for compliance review submission.',
      });
      return;
    }

    // 1. Verify existence of task
    const checkSql = `
      SELECT ct.id, ct.institution_id, ct.status, r.title AS regulation_title
      FROM Compliance_Tasks ct
      JOIN Regulations r ON ct.regulation_id = r.id
      WHERE ct.id = $1
      LIMIT 1;
    `;
    const checkResult = await query(checkSql, [id]);

    if (checkResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: `Compliance task with ID '${id}' was not found.`,
      });
      return;
    }

    const task = checkResult.rows[0];

    // Boundary check: If institution_admin, ensure task belongs to their institution
    if (user.role === 'institution_admin' && user.institution_id && task.institution_id !== user.institution_id) {
      res.status(403).json({
        success: false,
        message: 'Access forbidden: You cannot submit compliance feedback for tasks belonging to another institution.',
      });
      return;
    }

    // 2. Update task with feedback and set status to UNDER_REVIEW
    const updateSql = `
      UPDATE Compliance_Tasks
      SET 
        feedback_text = COALESCE($1, feedback_text),
        document_url = COALESCE($2, document_url),
        status = 'UNDER_REVIEW',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;

    const updateResult = await query(updateSql, [
      feedback_text ? String(feedback_text).trim() : null,
      document_url ? String(document_url).trim() : null,
      id,
    ]);

    const updatedTask = updateResult.rows[0];

    console.log(
      `[Regulatory Engine] Institution ${updatedTask.institution_id} submitted compliance feedback for task ${updatedTask.id}. Status set to UNDER_REVIEW.`
    );

    res.status(200).json({
      success: true,
      message: 'Compliance feedback and supplementary documentation submitted successfully. Status updated to UNDER_REVIEW.',
      data: updatedTask,
    });
  } catch (error: any) {
    console.error('[RegulationController.submitComplianceFeedback] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit compliance feedback.',
      error: error.message,
    });
  }
};

export default {
  createRegulation,
  getPendingTasks,
  submitComplianceFeedback,
};
