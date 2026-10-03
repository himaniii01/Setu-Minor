import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import path from 'path';

import router from './routes';
import swaggerDocument from './swagger.json';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Disabled for Swagger UI compatibility
}));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded. Please try again later.'
    }
  }
});
app.use('/api', limiter);

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root Landing Info & Links
app.get('/', (req, res) => {
  if (req.headers.accept?.includes('application/json') && !req.headers.accept?.includes('text/html')) {
    return res.json({
      name: 'SETU Interoperability Gateway API',
      status: 'ACTIVE',
      version: '1.0.0',
      documentation: '/api/docs',
      health: '/health',
      endpoints: '/api/v1'
    });
  }
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SETU Government API Gateway</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #08234D; color: #F8FAFC; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
        .card { background: #0F346C; border-radius: 24px; border: 1px solid rgba(245, 158, 11, 0.4); max-width: 620px; width: 100%; padding: 36px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .badge { display: inline-flex; align-items: center; gap: 6px; background: #065F46; color: #34D399; font-weight: 800; font-size: 12px; padding: 6px 14px; border-radius: 9999px; margin-bottom: 20px; text-transform: uppercase; tracking-wide: 1px; }
        h1 { color: #F59E0B; font-size: 28px; margin-top: 0; margin-bottom: 10px; font-weight: 900; }
        p { color: #CBD5E1; line-height: 1.6; margin-bottom: 28px; font-size: 14px; }
        .links { display: flex; flex-direction: column; gap: 14px; }
        a { background: #1E293B; color: #F8FAFC; text-decoration: none; padding: 14px 20px; border-radius: 14px; font-weight: 700; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155; }
        a:hover { background: #F59E0B; color: #0F172A; border-color: #F59E0B; }
        .tag { font-size: 12px; opacity: 0.9; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">● SETU Backend Interoperability Gateway Online</span>
        <h1>SETU Government API Server</h1>
        <p>Central interoperability REST API gateway for unified citizen service discovery, consent management, DigiLocker vault sync, and statutory status normalization.</p>
        <div class="links">
          <a href="http://localhost:3000">🌐 Open Citizen Portal <span class="tag">http://localhost:3000</span></a>
          <a href="/api/docs">📚 OpenAPI / Swagger Documentation <span class="tag">/api/docs</span></a>
          <a href="/health">🩺 System Health Status <span class="tag">/health</span></a>
          <a href="/api/v1/services">📋 Services Catalog Endpoint <span class="tag">/api/v1/services</span></a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    system: 'SETU Academic Interoperability Gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Router (/api/v1)
app.use('/api/v1', router);

// Standard 404 Fallback
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Resource path '${req.originalUrl}' not found on SETU Gateway`
    }
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 SETU Backend Interoperability Gateway listening on http://localhost:${PORT}`);
    console.log(`📚 OpenAPI / Swagger Documentation available at http://localhost:${PORT}/api/docs`);
  });
}

export default app;
