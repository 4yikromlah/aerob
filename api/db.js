import { createPool } from '@neondatabase/serverless';

// Pool created in module scope so it can be reused across invocations
// (prevents creating a new connection per request in serverless environments).
const pool = createPool(process.env.NEON_DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT NOW() as now');
    client.release();
    return res.status(200).json({ ok: true, time: rows[0].now });
  } catch (err) {
    console.error('DB error', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
