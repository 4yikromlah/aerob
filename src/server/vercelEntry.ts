import express from 'express';
import apiRouter from './api';
import { initDatabase } from './db';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Make sure database is initialized (tables created & seeded if needed)
initDatabase().catch(err => {
  console.error("Database connection failure in serverless entry:", err);
});

// Mount the same API router
app.use('/api', apiRouter);

export default app;
