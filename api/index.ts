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

// Register the same API router under /api
app.use('/api', apiRouter);

export default app;
