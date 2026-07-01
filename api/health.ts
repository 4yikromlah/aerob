import { createPool } from '@neondatabase/serverless';

const pool = createPool(process.env.NEON_DATABASE_URL as string);

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  // Liveness quick response
  if (req.query?.type === 'liveness') {
    return res.status(200).json({ ok: true, live: true, time: new Date().toISOString() });
  }

  // Readiness: try lightweight DB query
  try {
    const client = await pool.connect();
    try {
      const r = await client.query('SELECT 1 as ok');
      client.release();
      if (r && r.rowCount === 1) {
        return res.status(200).json({ ok: true, db: 'ok' });
      }
      return res.status(503).json({ ok: false, db: 'unavailable' });
    } catch (e) {
      client.release();
      return res.status(503).json({ ok: false, db: 'error', error: String(e) });
    }
  } catch (e) {
    return res.status(503).json({ ok: false, db: 'connection_failed', error: String(e) });
  }
}
