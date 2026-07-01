import { createPool } from '@neondatabase/serverless';

const pool = createPool(process.env.NEON_DATABASE_URL as string);

// Utility: parse id from query or body
function getIdFromReq(req: any) {
  return (req.query?.id as string) || (req.body && (req.body.id as string)) || null;
}

async function query(sql: string, params: any[] = []) {
  const client = await pool.connect();
  try {
    const res = await client.query(sql, params);
    return res;
  } finally {
    client.release();
  }
}

export default async function handler(req: any, res: any) {
  // CRUD for `notes` table:
  // CREATE: POST /api/db  { title, content }
  // READ list: GET /api/db
  // READ single: GET /api/db?id=<id>
  // UPDATE: PUT /api/db  { id, title?, content? }
  // DELETE: DELETE /api/db?id=<id>
  try {
    if (req.method === 'GET') {
      const id = getIdFromReq(req);
      if (id) {
        const r = await query('SELECT id, title, content, created_at FROM notes WHERE id = $1', [id]);
        if (r.rowCount === 0) return res.status(404).json({ ok: false, error: 'Not found' });
        return res.status(200).json({ ok: true, note: r.rows[0] });
      } else {
        const r = await query('SELECT id, title, content, created_at FROM notes ORDER BY created_at DESC LIMIT 100');
        return res.status(200).json({ ok: true, notes: r.rows });
      }
    }

    if (req.method === 'POST') {
      const { title, content } = req.body || {};
      if (!title) return res.status(400).json({ ok: false, error: 'title is required' });
      const r = await query(
        'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING id, title, content, created_at',
        [title, content || null]
      );
      return res.status(201).json({ ok: true, note: r.rows[0] });
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const { id, title, content } = req.body || {};
      if (!id) return res.status(400).json({ ok: false, error: 'id is required' });
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;
      if (title !== undefined) { sets.push(`title = $${idx++}`); params.push(title); }
      if (content !== undefined) { sets.push(`content = $${idx++}`); params.push(content); }
      if (sets.length === 0) return res.status(400).json({ ok: false, error: 'nothing to update' });
      params.push(id);
      const sql = `UPDATE notes SET ${sets.join(', ')} WHERE id = $${idx} RETURNING id, title, content, created_at`;
      const r = await query(sql, params);
      if (r.rowCount === 0) return res.status(404).json({ ok: false, error: 'Not found' });
      return res.status(200).json({ ok: true, note: r.rows[0] });
    }

    if (req.method === 'DELETE') {
      const id = getIdFromReq(req);
      if (!id) return res.status(400).json({ ok: false, error: 'id is required' });
      const r = await query('DELETE FROM notes WHERE id = $1 RETURNING id', [id]);
      if (r.rowCount === 0) return res.status(404).json({ ok: false, error: 'Not found' });
      return res.status(200).json({ ok: true, deletedId: r.rows[0].id });
    }

    res.setHeader('Allow', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(405).end('Method Not Allowed');
  } catch (err) {
    console.error('DB handler error', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
