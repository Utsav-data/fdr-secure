import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('[Database Warning]: DATABASE_URL is not set in environment variables.');
}

export const pool = new Pool({
  connectionString: connectionString || 'postgresql://postgres:postgres@localhost:5432/aicte_fdr_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err: Error) => {
  console.error('[Database Pool Error]: Unexpected error on idle PostgreSQL client:', err.message);
});

/**
 * Execute a SQL query using the connection pool
 * @param text SQL query string
 * @param params Query parameters for safe parameterized execution
 * @returns Promise<QueryResult<T>>
 */
export const query = async <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Database Query - ${duration}ms]:`, text.replace(/\s+/g, ' ').trim());
    }
    return res;
  } catch (error) {
    console.error(`[Database Query Error] on statement: "${text}":`, error);
    throw error;
  }
};

export default {
  query,
  pool,
};
