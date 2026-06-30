import express from 'express';
import apiRouter from '../src/server/api';
import { initDatabase } from '../src/server/db';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize database (non-blocking)
initDatabase().catch(err => {
  console.error("Database initialization failed on Vercel:", err);
});

// Log incoming request paths to help debugging
app.use((req, res, next) => {
  console.log(`[Vercel Serverless] Incoming: ${req.method} ${req.url} (original: ${req.originalUrl})`);
  next();
});

// Mount the API router on both /api and / to handle different Vercel routing modes
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
