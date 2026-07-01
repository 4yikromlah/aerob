import { Router } from 'express';
import { sqlClient, isDbConnected, localStore, ensureDbInitialized } from './db';

const router = Router();

// Middleware to block requests until Neon DB tables are initialized
router.use(async (req, res, next) => {
  try {
    await ensureDbInitialized();
  } catch (err) {
    console.error("Database initialization middleware failed:", err);
  }
  next();
});

// Helper to convert DB rows with stringified JSON into correct JS objects
function parseMember(row: any) {
  if (!row) return row;
  try {
    const interestsVal = typeof row.interests === 'string' ? JSON.parse(row.interests) : (row.interests || []);
    return {
      id: row.id,
      name: row.name,
      class: row.class,
      role: row.role,
      email: row.email,
      joinedDate: row.joineddate || row.joinedDate || '',
      interests: Array.isArray(interestsVal) ? interestsVal : [],
      username: row.username,
      password: row.password,
      memberType: row.membertype || row.memberType || 'Pemula'
    };
  } catch {
    return {
      id: row.id,
      name: row.name,
      class: row.class,
      role: row.role,
      email: row.email,
      joinedDate: row.joineddate || row.joinedDate || '',
      interests: [],
      username: row.username,
      password: row.password,
      memberType: row.membertype || row.memberType || 'Pemula'
    };
  }
}

function parseProgram(row: any) {
  if (!row) return row;
  return {
    id: row.id,
    title: row.title,
    iconName: row.iconname || row.iconName || '',
    description: row.description,
    detailedInfo: row.detailedinfo || row.detailedInfo || '',
    difficulty: row.difficulty,
    duration: row.duration,
    imageUrl: row.imageurl || row.imageUrl || undefined
  };
}

function parseGallery(row: any) {
  if (!row) return row;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    imageUrl: row.imageurl || row.imageUrl || '',
    description: row.description,
    date: row.date
  };
}

function parseNews(row: any) {
  if (!row) return row;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    summary: row.summary,
    content: row.content,
    date: row.date,
    author: row.author,
    readTime: row.readtime || row.readTime || '',
    imageUrl: row.imageurl || row.imageUrl || undefined
  };
}

function parseProduct(row: any) {
  if (!row) return row;
  try {
    const specsVal = typeof row.specs === 'string' ? JSON.parse(row.specs) : (row.specs || []);
    const techVal = typeof row.technologies === 'string' ? JSON.parse(row.technologies) : (row.technologies || []);
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description,
      specs: Array.isArray(specsVal) ? specsVal : [],
      technologies: Array.isArray(techVal) ? techVal : [],
      imageUrl: row.imageurl || row.imageUrl || '',
      creator: row.creator,
      year: row.year,
      status: row.status
    };
  } catch {
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description,
      specs: [],
      technologies: [],
      imageUrl: row.imageurl || row.imageUrl || '',
      creator: row.creator,
      year: row.year,
      status: row.status
    };
  }
}

// Global database connection status endpoint
router.get('/db-status', (req, res) => {
  res.json({
    connected: isDbConnected,
    provider: isDbConnected ? 'Neon SQL (PostgreSQL)' : 'In-Memory Fallback Local Storage'
  });
});

// Unified bootstrap/initial load endpoint to fetch all database collections in a single round-trip
router.get('/all-data', async (req, res) => {
  if (isDbConnected && sqlClient) {
    try {
      const [
        membersRows,
        inventoryRows,
        programsRows,
        galleryRows,
        newsRows,
        productsRows,
        achievementsRows,
        settingsRows
      ] = await Promise.all([
        sqlClient`SELECT * FROM members ORDER BY name ASC`,
        sqlClient`SELECT * FROM inventory ORDER BY name ASC`,
        sqlClient`SELECT * FROM programs ORDER BY title ASC`,
        sqlClient`SELECT * FROM gallery ORDER BY date DESC`,
        sqlClient`SELECT * FROM news ORDER BY date DESC`,
        sqlClient`SELECT * FROM products ORDER BY name ASC`,
        sqlClient`SELECT * FROM achievements ORDER BY year DESC`,
        sqlClient`SELECT key, value FROM settings`
      ]);

      const settingsMap: Record<string, any> = {};
      for (const row of settingsRows) {
        try {
          settingsMap[row.key] = JSON.parse(row.value);
        } catch {
          settingsMap[row.key] = row.value;
        }
      }

      res.json({
        members: membersRows.map(parseMember),
        inventory: inventoryRows,
        programs: programsRows.map(parseProgram),
        gallery: galleryRows.map(parseGallery),
        news: newsRows.map(parseNews),
        products: productsRows.map(parseProduct),
        achievements: achievementsRows,
        settings: settingsMap
      });
    } catch (err) {
      console.error("GET /all-data error (gracefully falling back to local memory store):", err);
      res.json({
        members: localStore.members,
        inventory: localStore.inventory,
        programs: localStore.programs,
        gallery: localStore.gallery,
        news: localStore.news,
        products: localStore.products,
        achievements: localStore.achievements,
        settings: localStore.settings,
        dbError: String(err)
      });
    }
  } else {
    res.json({
      members: localStore.members,
      inventory: localStore.inventory,
      programs: localStore.programs,
      gallery: localStore.gallery,
      news: localStore.news,
      products: localStore.products,
      achievements: localStore.achievements,
      settings: localStore.settings
    });
  }
});

// --- MEMBERS ENDPOINTS ---
router.get('/members', async (req, res) => {
  if (isDbConnected && sqlClient) {
    try {
      const rows = await sqlClient`SELECT * FROM members ORDER BY name ASC`;
      res.json(rows.map(parseMember));
    } catch (err) {
      console.error("GET /members error, falling back to localStore:", err);
      res.json(localStore.members);
    }
  } else {
    res.json(localStore.members);
  }
});

router.post('/members', async (req, res) => {
  const m = req.body;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`
        INSERT INTO members (id, name, class, role, email, joinedDate, interests, username, password, memberType)
        VALUES (${m.id}, ${m.name}, ${m.class}, ${m.role}, ${m.email}, ${m.joinedDate}, ${JSON.stringify(m.interests || [])}, ${m.username || null}, ${m.password || null}, ${m.memberType || null})
      `;
      res.json(m);
    } catch (err) {
      console.error("POST /members error:", err);
      res.status(500).json({ error: "Failed to create member" });
    }
  } else {
    localStore.members.push(m);
    res.json(m);
  }
});

router.put('/members/:id', async (req, res) => {
  const { id } = req.params;
  const m = req.body;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`
        UPDATE members 
        SET name = ${m.name}, class = ${m.class}, role = ${m.role}, email = ${m.email}, 
            joinedDate = ${m.joinedDate}, interests = ${JSON.stringify(m.interests || [])}, 
            username = ${m.username || null}, password = ${m.password || null}, memberType = ${m.memberType || null}
        WHERE id = ${id}
      `;
      res.json(m);
    } catch (err) {
      console.error("PUT /members error:", err);
      res.status(500).json({ error: "Failed to update member" });
    }
  } else {
    const idx = localStore.members.findIndex(x => x.id === id);
    if (idx !== -1) {
      localStore.members[idx] = m;
    }
    res.json(m);
  }
});

router.delete('/members/:id', async (req, res) => {
  const { id } = req.params;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`DELETE FROM members WHERE id = ${id}`;
      res.json({ success: true });
    } catch (err) {
      console.error("DELETE /members error:", err);
      res.status(500).json({ error: "Failed to delete member" });
    }
  } else {
    localStore.members = localStore.members.filter(x => x.id !== id);
    res.json({ success: true });
  }
});


// --- INVENTORY ENDPOINTS ---
router.get('/inventory', async (req, res) => {
  if (isDbConnected && sqlClient) {
    try {
      const rows = await sqlClient`SELECT * FROM inventory ORDER BY name ASC`;
      res.json(rows);
    } catch (err) {
      console.error("GET /inventory error, falling back to localStore:", err);
      res.json(localStore.inventory);
    }
  } else {
    res.json(localStore.inventory);
  }
});

router.post('/inventory', async (req, res) => {
  const item = req.body;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`
        INSERT INTO inventory (id, name, category, quantity, unit, status, location)
        VALUES (${item.id}, ${item.name}, ${item.category}, ${item.quantity}, ${item.unit}, ${item.status}, ${item.location})
      `;
      res.json(item);
    } catch (err) {
      console.error("POST /inventory error:", err);
      res.status(500).json({ error: "Failed to create inventory item" });
    }
  } else {
    localStore.inventory.push(item);
    res.json(item);
  }
});

router.put('/inventory/:id', async (req, res) => {
  const { id } = req.params;
  const item = req.body;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`
        UPDATE inventory 
        SET name = ${item.name}, category = ${item.category}, quantity = ${item.quantity}, 
            unit = ${item.unit}, status = ${item.status}, location = ${item.location}
        WHERE id = ${id}
      `;
      res.json(item);
    } catch (err) {
      console.error("PUT /inventory error:", err);
      res.status(500).json({ error: "Failed to update inventory item" });
    }
  } else {
    const idx = localStore.inventory.findIndex(x => x.id === id);
    if (idx !== -1) {
      localStore.inventory[idx] = item;
    }
    res.json(item);
  }
});

router.delete('/inventory/:id', async (req, res) => {
  const { id } = req.params;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`DELETE FROM inventory WHERE id = ${id}`;
      res.json({ success: true });
    } catch (err) {
      console.error("DELETE /inventory error:", err);
      res.status(500).json({ error: "Failed to delete inventory item" });
    }
  } else {
    localStore.inventory = localStore.inventory.filter(x => x.id !== id);
    res.json({ success: true });
  }
});


// --- PROGRAMS ENDPOINTS ---
router.get('/programs', async (req, res) => {
  if (isDbConnected && sqlClient) {
    try {
      const rows = await sqlClient`SELECT * FROM programs ORDER BY title ASC`;
      res.json(rows.map(parseProgram));
    } catch (err) {
      console.error("GET /programs error, falling back to localStore:", err);
      res.json(localStore.programs);
    }
  } else {
    res.json(localStore.programs);
  }
});

router.post('/programs', async (req, res) => {
  const p = req.body;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`
        INSERT INTO programs (id, title, iconName, description, detailedInfo, difficulty, duration, imageUrl)
        VALUES (${p.id}, ${p.title}, ${p.iconName}, ${p.description}, ${p.detailedInfo}, ${p.difficulty}, ${p.duration}, ${p.imageUrl || null})
      `;
      res.json(p);
    } catch (err) {
      console.error("POST /programs error:", err);
      res.status(500).json({ error: "Failed to create program" });
    }
  } else {
    localStore.programs.push(p);
    res.json(p);
  }
});

router.put('/programs/:id', async (req, res) => {
  const { id } = req.params;
  const p = req.body;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`
        UPDATE programs 
        SET title = ${p.title}, iconName = ${p.iconName}, description = ${p.description}, 
            detailedInfo = ${p.detailedInfo}, difficulty = ${p.difficulty}, 
            duration = ${p.duration}, imageUrl = ${p.imageUrl || null}
        WHERE id = ${id}
      `;
      res.json(p);
    } catch (err) {
      console.error("PUT /programs error:", err);
      res.status(500).json({ error: "Failed to update program" });
    }
  } else {
    const idx = localStore.programs.findIndex(x => x.id === id);
    if (idx !== -1) {
      localStore.programs[idx] = p;
    }
    res.json(p);
  }
});

router.delete('/programs/:id', async (req, res) => {
  const { id } = req.params;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`DELETE FROM programs WHERE id = ${id}`;
      res.json({ success: true });
    } catch (err) {
      console.error("DELETE /programs error:", err);
      res.status(500).json({ error: "Failed to delete program" });
    }
  } else {
    localStore.programs = localStore.programs.filter(x => x.id !== id);
    res.json({ success: true });
  }
});


// --- GALLERY ENDPOINTS ---
router.get('/gallery', async (req, res) => {
  if (isDbConnected && sqlClient) {
    try {
      const rows = await sqlClient`SELECT * FROM gallery ORDER BY date DESC`;
      res.json(rows.map(parseGallery));
    } catch (err) {
      console.error("GET /gallery error, falling back to localStore:", err);
      res.json(localStore.gallery);
    }
  } else {
    res.json(localStore.gallery);
  }
});

router.post('/gallery', async (req, res) => {
  const img = req.body;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`
        INSERT INTO gallery (id, title, category, imageUrl, description, date)
        VALUES (${img.id}, ${img.title}, ${img.category}, ${img.imageUrl}, ${img.description}, ${img.date})
      `;
      res.json(img);
    } catch (err) {
      console.error("POST /gallery error:", err);
      res.status(500).json({ error: "Failed to create gallery image" });
    }
  } else {
    localStore.gallery.push(img);
    res.json(img);
  }
});

router.put('/gallery/:id', async (req, res) => {
  const { id } = req.params;
  const img = req.body;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`
        UPDATE gallery 
        SET title = ${img.title}, category = ${img.category}, imageUrl = ${img.imageUrl}, 
            description = ${img.description}, date = ${img.date}
        WHERE id = ${id}
      `;
      res.json(img);
    } catch (err) {
      console.error("PUT /gallery error:", err);
      res.status(500).json({ error: "Failed to update gallery image" });
    }
  } else {
    const idx = localStore.gallery.findIndex(x => x.id === id);
    if (idx !== -1) {
      localStore.gallery[idx] = img;
    }
    res.json(img);
  }
});

router.delete('/gallery/:id', async (req, res) => {
  const { id } = req.params;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`DELETE FROM gallery WHERE id = ${id}`;
      res.json({ success: true });
    } catch (err) {
      console.error("DELETE /gallery error:", err);
      res.status(500).json({ error: "Failed to delete gallery image" });
    }
  } else {
    localStore.gallery = localStore.gallery.filter(x => x.id !== id);
    res.json({ success: true });
  }
});


// --- NEWS ENDPOINTS ---
router.get('/news', async (req, res) => {
  if (isDbConnected && sqlClient) {
    try {
      const rows = await sqlClient`SELECT * FROM news ORDER BY date DESC`;
      res.json(rows.map(parseNews));
    } catch (err) {
      console.error("GET /news error, falling back to localStore:", err);
      res.json(localStore.news);
    }
  } else {
    res.json(localStore.news);
  }
});

router.post('/news', async (req, res) => {
  const item = req.body;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`
        INSERT INTO news (id, title, category, summary, content, date, author, readTime, imageUrl)
        VALUES (${item.id}, ${item.title}, ${item.category}, ${item.summary}, ${item.content}, ${item.date}, ${item.author}, ${item.readTime}, ${item.imageUrl || null})
      `;
      res.json(item);
    } catch (err) {
      console.error("POST /news error:", err);
      res.status(500).json({ error: "Failed to create news item" });
    }
  } else {
    localStore.news.push(item);
    res.json(item);
  }
});

router.put('/news/:id', async (req, res) => {
  const { id } = req.params;
  const item = req.body;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`
        UPDATE news 
        SET title = ${item.title}, category = ${item.category}, summary = ${item.summary}, 
            content = ${item.content}, date = ${item.date}, author = ${item.author}, 
            readTime = ${item.readTime}, imageUrl = ${item.imageUrl || null}
        WHERE id = ${id}
      `;
      res.json(item);
    } catch (err) {
      console.error("PUT /news error:", err);
      res.status(500).json({ error: "Failed to update news item" });
    }
  } else {
    const idx = localStore.news.findIndex(x => x.id === id);
    if (idx !== -1) {
      localStore.news[idx] = item;
    }
    res.json(item);
  }
});

router.delete('/news/:id', async (req, res) => {
  const { id } = req.params;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`DELETE FROM news WHERE id = ${id}`;
      res.json({ success: true });
    } catch (err) {
      console.error("DELETE /news error:", err);
      res.status(500).json({ error: "Failed to delete news item" });
    }
  } else {
    localStore.news = localStore.news.filter(x => x.id !== id);
    res.json({ success: true });
  }
});


// --- PRODUCTS ENDPOINTS ---
router.get('/products', async (req, res) => {
  if (isDbConnected && sqlClient) {
    try {
      const rows = await sqlClient`SELECT * FROM products ORDER BY name ASC`;
      res.json(rows.map(parseProduct));
    } catch (err) {
      console.error("GET /products error, falling back to localStore:", err);
      res.json(localStore.products);
    }
  } else {
    res.json(localStore.products);
  }
});

router.post('/products', async (req, res) => {
  const prod = req.body;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`
        INSERT INTO products (id, name, category, description, specs, technologies, imageUrl, creator, year, status)
        VALUES (${prod.id}, ${prod.name}, ${prod.category}, ${prod.description}, ${JSON.stringify(prod.specs || [])}, ${JSON.stringify(prod.technologies || [])}, ${prod.imageUrl}, ${prod.creator}, ${prod.year}, ${prod.status})
      `;
      res.json(prod);
    } catch (err) {
      console.error("POST /products error:", err);
      res.status(500).json({ error: "Failed to create product" });
    }
  } else {
    localStore.products.push(prod);
    res.json(prod);
  }
});

router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const prod = req.body;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`
        UPDATE products 
        SET name = ${prod.name}, category = ${prod.category}, description = ${prod.description}, 
            specs = ${JSON.stringify(prod.specs || [])}, technologies = ${JSON.stringify(prod.technologies || [])}, 
            imageUrl = ${prod.imageUrl}, creator = ${prod.creator}, year = ${prod.year}, status = ${prod.status}
        WHERE id = ${id}
      `;
      res.json(prod);
    } catch (err) {
      console.error("PUT /products error:", err);
      res.status(500).json({ error: "Failed to update product" });
    }
  } else {
    const idx = localStore.products.findIndex(x => x.id === id);
    if (idx !== -1) {
      localStore.products[idx] = prod;
    }
    res.json(prod);
  }
});

router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  if (isDbConnected && sqlClient) {
    try {
      await sqlClient`DELETE FROM products WHERE id = ${id}`;
      res.json({ success: true });
    } catch (err) {
      console.error("DELETE /products error:", err);
      res.status(500).json({ error: "Failed to delete product" });
    }
  } else {
    localStore.products = localStore.products.filter(x => x.id !== id);
    res.json({ success: true });
  }
});


// --- ACHIEVEMENTS ENDPOINTS ---
router.get('/achievements', async (req, res) => {
  if (isDbConnected && sqlClient) {
    try {
      const rows = await sqlClient`SELECT * FROM achievements ORDER BY year DESC`;
      res.json(rows);
    } catch (err) {
      console.error("GET /achievements error, falling back to localStore:", err);
      res.json(localStore.achievements);
    }
  } else {
    res.json(localStore.achievements);
  }
});

router.post('/achievements', async (req, res) => {
  const items = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: "Body must be an array of achievements" });
  }

  if (isDbConnected && sqlClient) {
    try {
      // Refresh entire achievements list to match dashboard's bulk edit
      await sqlClient`DELETE FROM achievements`;
      for (const ach of items) {
        await sqlClient`
          INSERT INTO achievements (id, title, year, rank, level, description)
          VALUES (${ach.id}, ${ach.title}, ${ach.year}, ${ach.rank}, ${ach.level}, ${ach.description})
        `;
      }
      res.json(items);
    } catch (err) {
      console.error("POST /achievements error:", err);
      res.status(500).json({ error: "Failed to sync achievements" });
    }
  } else {
    localStore.achievements = items;
    res.json(items);
  }
});


// --- SETTINGS / DYNAMIC CONTENT ENDPOINTS ---
router.get('/settings/:key', async (req, res) => {
  const { key } = req.params;
  if (isDbConnected && sqlClient) {
    try {
      const rows = await sqlClient`SELECT value FROM settings WHERE key = ${key}`;
      if (rows.length > 0) {
        let parsed;
        try {
          parsed = JSON.parse(rows[0].value);
        } catch (e) {
          // Fallback to the raw string if database contains un-stringified data
          parsed = rows[0].value;
        }
        res.json(parsed);
      } else {
        // Return default if not exists
        const fallbackValue = localStore.settings[key] !== undefined ? localStore.settings[key] : null;
        res.json(fallbackValue);
      }
    } catch (err) {
      console.error(`GET /settings/${key} error, falling back to localStore:`, err);
      const val = localStore.settings[key] !== undefined ? localStore.settings[key] : null;
      res.json(val);
    }
  } else {
    const val = localStore.settings[key] !== undefined ? localStore.settings[key] : null;
    res.json(val);
  }
});

router.post('/settings/:key', async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  
  if (isDbConnected && sqlClient) {
    try {
      // Upsert setting key-value pair
      await sqlClient`
        INSERT INTO settings (key, value)
        VALUES (${key}, ${JSON.stringify(value)})
        ON CONFLICT (key) 
        DO UPDATE SET value = ${JSON.stringify(value)}
      `;
      res.json({ success: true, key, value });
    } catch (err) {
      console.error(`POST /settings/${key} error:`, err);
      res.status(500).json({ error: `Failed to save setting ${key}` });
    }
  } else {
    localStore.settings[key] = value;
    res.json({ success: true, key, value });
  }
});

// --- DATABASE HEALTH CHECK ENDPOINT ---
router.get('/db-health', async (req, res) => {
  if (isDbConnected && sqlClient) {
    try {
      const start = Date.now();
      await sqlClient`SELECT 1`;
      const latency = Date.now() - start;
      res.json({
        status: 'connected',
        connected: true,
        latency: `${latency}ms`,
        fallback: false
      });
    } catch (err: any) {
      console.error("Database health check failed:", err);
      res.json({
        status: 'error',
        connected: false,
        error: err.message || String(err),
        fallback: false
      });
    }
  } else {
    res.json({
      status: 'fallback',
      connected: false,
      fallback: true
    });
  }
});

export default router;
