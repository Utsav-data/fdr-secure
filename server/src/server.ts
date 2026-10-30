import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Modular Routes
import authRoutes from './routes/auth.routes';
import fdrRoutes from './routes/fdr.routes';
import webhookRoutes from './routes/webhook.routes';
import regulationRoutes from './routes/regulation.routes';
import { initMaturityCron } from './cron/maturity.cron';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check & Root Diagnostics
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'AICTE Security Deposit/FDR Management Portal API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login',
      fdr: '/api/fdr',
      regulations: '/api/regulations',
      webhooks: '/api/webhooks',
      health: '/api/health',
    },
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'aicte-fdr-server',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/fdr', fdrRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/regulations', regulationRoutes);

// 404 Fallback Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.method} ${req.originalUrl}' not found.`,
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Global Error Handler]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : undefined,
  });
});

// Initialize Scheduled Background Cron Jobs
initMaturityCron();

// Start Server
app.listen(PORT, () => {
  console.log(`[AICTE FDR Server] Server listening on http://localhost:${PORT}`);
});

export default app;
