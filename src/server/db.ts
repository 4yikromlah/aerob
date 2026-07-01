import { neon } from '@neondatabase/serverless';
import { 
  INITIAL_MEMBERS, 
  INITIAL_INVENTORY, 
  PROGRAMS_DATA, 
  GALLERY_IMGS, 
  NEWS_DATA, 
  PRODUCTS_DATA, 
  EXTRACURRICULAR_PROFILE, 
  GENERAL_ACHIEVEMENTS, 
  PUBLIC_SERVICES 
} from '../data/roboticsData';

const databaseUrl = process.env.DATABASE_URL;

export const isDbConnected = !!databaseUrl;

let sqlClient: any = null;
if (isDbConnected) {
  try {
    sqlClient = neon(databaseUrl!);
    console.log("Initializing Neon SQL Database Connection...");
  } catch (err) {
    console.error("Error creating Neon client:", err);
  }
} else {
  console.warn("⚠️ DATABASE_URL is not defined. Falling back to local in-memory storage.");
}

export { sqlClient };

// In-memory fallbacks when DB is not connected
export const localStore = {
  members: [...INITIAL_MEMBERS],
  inventory: [...INITIAL_INVENTORY],
  programs: [...PROGRAMS_DATA],
  gallery: [...GALLERY_IMGS],
  news: [...NEWS_DATA],
  products: [...PRODUCTS_DATA],
  achievements: [...GENERAL_ACHIEVEMENTS],
  settings: {
    profile: EXTRACURRICULAR_PROFILE,
    public_services: PUBLIC_SERVICES,
    visimisi: null as any,
    general_info: "📢 INFO AKTIF: Kunjungan industri dan pameran karya robotika sasis pintar SMK Unggulan Teknologi akan dilangsungkan serentak pada tanggal 12 Juli 2026. Persiapkan modul line follower dan robot soccer roda Anda!",
    background: 'default-robot',
    primary_color: '#06B6D4',
    secondary_color: '#2563EB',
    logo: ''
  } as Record<string, any>
};

export async function initDatabase() {
  if (!isDbConnected || !sqlClient) {
    return;
  }

  try {
    // Create tables
    await sqlClient`
      CREATE TABLE IF NOT EXISTS members (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        class TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT NOT NULL,
        joinedDate TEXT NOT NULL,
        interests TEXT NOT NULL,
        username TEXT,
        password TEXT,
        memberType TEXT
      )
    `;

    await sqlClient`
      CREATE TABLE IF NOT EXISTS inventory (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit TEXT NOT NULL,
        status TEXT NOT NULL,
        location TEXT NOT NULL
      )
    `;

    await sqlClient`
      CREATE TABLE IF NOT EXISTS programs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        iconName TEXT NOT NULL,
        description TEXT NOT NULL,
        detailedInfo TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        duration TEXT NOT NULL,
        imageUrl TEXT
      )
    `;

    await sqlClient`
      CREATE TABLE IF NOT EXISTS gallery (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL
      )
    `;

    await sqlClient`
      CREATE TABLE IF NOT EXISTS news (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        author TEXT NOT NULL,
        readTime TEXT NOT NULL,
        imageUrl TEXT
      )
    `;

    await sqlClient`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        specs TEXT NOT NULL,
        technologies TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        creator TEXT NOT NULL,
        year TEXT NOT NULL,
        status TEXT NOT NULL
      )
    `;

    await sqlClient`
      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        year TEXT NOT NULL,
        rank TEXT NOT NULL,
        level TEXT NOT NULL,
        description TEXT NOT NULL
      )
    `;

    await sqlClient`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `;

    console.log("✅ Neon SQL Database tables checked/created.");

    // Seed tables if empty
    const membersCountRes = await sqlClient`SELECT COUNT(*) FROM members`;
    const membersCount = parseInt(membersCountRes[0].count, 10);
    if (membersCount === 0) {
      console.log("Seeding members database table...");
      for (const m of INITIAL_MEMBERS) {
        await sqlClient`
          INSERT INTO members (id, name, class, role, email, joinedDate, interests, username, password, memberType)
          VALUES (${m.id}, ${m.name}, ${m.class}, ${m.role}, ${m.email}, ${m.joinedDate}, ${JSON.stringify(m.interests)}, ${m.username || null}, ${m.password || null}, ${m.memberType || null})
        `;
      }
    }

    const inventoryCountRes = await sqlClient`SELECT COUNT(*) FROM inventory`;
    const inventoryCount = parseInt(inventoryCountRes[0].count, 10);
    if (inventoryCount === 0) {
      console.log("Seeding inventory database table...");
      for (const item of INITIAL_INVENTORY) {
        await sqlClient`
          INSERT INTO inventory (id, name, category, quantity, unit, status, location)
          VALUES (${item.id}, ${item.name}, ${item.category}, ${item.quantity}, ${item.unit}, ${item.status}, ${item.location})
        `;
      }
    }

    const programsCountRes = await sqlClient`SELECT COUNT(*) FROM programs`;
    const programsCount = parseInt(programsCountRes[0].count, 10);
    if (programsCount === 0) {
      console.log("Seeding programs database table...");
      for (const p of PROGRAMS_DATA) {
        await sqlClient`
          INSERT INTO programs (id, title, iconName, description, detailedInfo, difficulty, duration, imageUrl)
          VALUES (${p.id}, ${p.title}, ${p.iconName}, ${p.description}, ${p.detailedInfo}, ${p.difficulty}, ${p.duration}, ${p.imageUrl || null})
        `;
      }
    }

    const galleryCountRes = await sqlClient`SELECT COUNT(*) FROM gallery`;
    const galleryCount = parseInt(galleryCountRes[0].count, 10);
    if (galleryCount === 0) {
      console.log("Seeding gallery database table...");
      for (const img of GALLERY_IMGS) {
        await sqlClient`
          INSERT INTO gallery (id, title, category, imageUrl, description, date)
          VALUES (${img.id}, ${img.title}, ${img.category}, ${img.imageUrl}, ${img.description}, ${img.date})
        `;
      }
    }

    const newsCountRes = await sqlClient`SELECT COUNT(*) FROM news`;
    const newsCount = parseInt(newsCountRes[0].count, 10);
    if (newsCount === 0) {
      console.log("Seeding news database table...");
      for (const item of NEWS_DATA) {
        await sqlClient`
          INSERT INTO news (id, title, category, summary, content, date, author, readTime, imageUrl)
          VALUES (${item.id}, ${item.title}, ${item.category}, ${item.summary}, ${item.content}, ${item.date}, ${item.author}, ${item.readTime}, ${item.imageUrl || null})
        `;
      }
    }

    const productsCountRes = await sqlClient`SELECT COUNT(*) FROM products`;
    const productsCount = parseInt(productsCountRes[0].count, 10);
    if (productsCount === 0) {
      console.log("Seeding products database table...");
      for (const prod of PRODUCTS_DATA) {
        await sqlClient`
          INSERT INTO products (id, name, category, description, specs, technologies, imageUrl, creator, year, status)
          VALUES (${prod.id}, ${prod.name}, ${prod.category}, ${prod.description}, ${JSON.stringify(prod.specs)}, ${JSON.stringify(prod.technologies)}, ${prod.imageUrl}, ${prod.creator}, ${prod.year}, ${prod.status})
        `;
      }
    }

    const achievementsCountRes = await sqlClient`SELECT COUNT(*) FROM achievements`;
    const achievementsCount = parseInt(achievementsCountRes[0].count, 10);
    if (achievementsCount === 0) {
      console.log("Seeding achievements database table...");
      for (const ach of GENERAL_ACHIEVEMENTS) {
        await sqlClient`
          INSERT INTO achievements (id, title, year, rank, level, description)
          VALUES (${ach.id}, ${ach.title}, ${ach.year}, ${ach.rank}, ${ach.level}, ${ach.description})
        `;
      }
    }

    const settingsCountRes = await sqlClient`SELECT COUNT(*) FROM settings`;
    const settingsCount = parseInt(settingsCountRes[0].count, 10);
    if (settingsCount === 0) {
      console.log("Seeding settings database table...");
      await sqlClient`INSERT INTO settings (key, value) VALUES ('profile', ${JSON.stringify(EXTRACURRICULAR_PROFILE)})`;
      await sqlClient`INSERT INTO settings (key, value) VALUES ('public_services', ${JSON.stringify(PUBLIC_SERVICES)})`;
      await sqlClient`INSERT INTO settings (key, value) VALUES ('visimisi', 'null')`;
      await sqlClient`INSERT INTO settings (key, value) VALUES ('general_info', ${JSON.stringify("📢 INFO AKTIF: Kunjungan industri dan pameran karya robotika sasis pintar SMK Unggulan Teknologi akan dilangsungkan serentak pada tanggal 12 Juli 2026. Persiapkan modul line follower dan robot soccer roda Anda!")})`;
      await sqlClient`INSERT INTO settings (key, value) VALUES ('background', ${JSON.stringify('default-robot')})`;
      await sqlClient`INSERT INTO settings (key, value) VALUES ('primary_color', ${JSON.stringify('#06B6D4')})`;
      await sqlClient`INSERT INTO settings (key, value) VALUES ('secondary_color', ${JSON.stringify('#2563EB')})`;
      await sqlClient`INSERT INTO settings (key, value) VALUES ('logo', ${JSON.stringify('')})`;
    }

    console.log("🎉 Neon SQL Database seeding finished successfully.");
  } catch (err) {
    console.error("❌ Database initialization or seeding failed:", err);
  }
}

let isInitialized = false;
let initPromise: Promise<void> | null = null;

export async function ensureDbInitialized() {
  if (!isDbConnected || !sqlClient) {
    return;
  }
  if (isInitialized) {
    return;
  }
  if (!initPromise) {
    console.log("🚀 Starting database initialization and checking tables...");
    initPromise = initDatabase().then(() => {
      isInitialized = true;
      console.log("🚀 Database initialization complete!");
    }).catch(err => {
      console.error("❌ Database initialization failed inside ensureDbInitialized:", err);
      initPromise = null; // Reset to allow retry on next request
      throw err;
    });
  }
  await initPromise;
}

