import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { vulnerableRoute } from './vulnerable.js';
import { secureRoute } from './secure.js';
import { logger } from './logger.js';
import { demoRouter } from './demos.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML banner, assets)
app.use(express.static(join(__dirname, '../public')));

// Health check
app.get('/api/health', (req, res) => {
  logger.log('health', 'Health check passed');
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// XSS Vulnerable endpoint
app.post('/api/vulnerable/submit', vulnerableRoute);

// XSS Secure endpoint
app.post('/api/secure/submit', secureRoute);

// ─────────────────────────────────────────────────────────────
// EDUCATIONAL DEMO ROUTES — intentionally vulnerable
// Routes: /demo/reflected-xss  and  /demo/stored-xss
// DO NOT use these patterns in any production application.
// ─────────────────────────────────────────────────────────────
app.use('/demo', demoRouter);

// Get comments (both modes share same storage for demo)
app.get('/api/comments/vulnerable', (req, res) => {
  logger.log('info', 'Fetching vulnerable comments');
  res.json({ comments: global.comments || [] });
});

app.get('/api/comments/secure', (req, res) => {
  logger.log('info', 'Fetching secure comments');
  res.json({ comments: global.comments || [] });
});

// Clear comments
app.post('/api/comments/clear', (req, res) => {
  global.comments = [];
  logger.log('info', 'Comments cleared');
  res.json({ success: true });
});

// Get activity log
app.get('/api/logs', (req, res) => {
  res.json({ logs: logger.getLogs() });
});

// Initialize comments storage
global.comments = [];

// Error handler
app.use((err, req, res, next) => {
  logger.log('error', `Server error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  logger.log('info', `XSS Lab Target started on port ${PORT}`);
  console.log(`🔴 INTENTIONALLY VULNERABLE XSS LAB TARGET`);
  console.log(`📍 Local lab only: http://localhost:${PORT}`);
  console.log(`⚠️  DO NOT expose this to the internet`);
});
