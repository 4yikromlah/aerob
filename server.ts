import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import apiRouter from "./src/server/api";
import { initDatabase } from "./src/server/db";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Setup request body parsing middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Initialize and check database connection & auto-migration
  await initDatabase();

  // Register REST API endpoints
  app.use("/api", apiRouter);

  // Vite development or production serving
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite runs in DEVELOPMENT mode");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Vite runs in PRODUCTION mode");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 SI Manajemen Ekstrakurikuler ROBOTIKA full-stack server is active at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server failure on boot:", err);
});
