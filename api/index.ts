import express from 'express';
import apiRouter from '../src/server/api';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Log incoming request paths to help debugging
app.use((req, res, next) => {
  console.log(`[Vercel Serverless] Incoming: ${req.method} ${req.url} (original: ${req.originalUrl})`);
  next();
});

// Register the same API router under /api and /
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
