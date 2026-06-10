import express, { Request, Response, NextFunction } from "express";
import compression from "compression";
import helmet from "helmet";
import path from "path";
import fs from "fs";

// ─────────────────────────────────────────────
// CONFIG — edit these to match your setup
// ─────────────────────────────────────────────
const PORT: number = parseInt(process.env.PORT ?? "3000", 10);
const HOST: string = process.env.HOST ?? "127.0.0.1"; // bind to localhost; Cloudflare Tunnel connects here
const NODE_ENV: string = process.env.NODE_ENV ?? "production";
// ─────────────────────────────────────────────

const app = express();

// Security headers (Helmet sets sane defaults)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],    // allow inline styles in HTML
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    // Cloudflare handles HTTPS; tell browsers to only use HTTPS
    hsts: {
      maxAge: 63072000,       // 2 years
      includeSubDomains: true,
      preload: true,
    },
  })
);

// Gzip compression — the site is tiny, but good habit
app.use(compression());

// Serve static files from /public with aggressive caching
app.use(
  express.static(path.join(__dirname, "..", "public"), {
    maxAge: "7d",             // cache static assets for 7 days
    etag: true,
    lastModified: true,
    // Don't cache the HTML itself so updates show immediately
    setHeaders: (res: Response, filePath: string) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

// ─────────────────────────────────────────────
// ROUTES — add new pages here
// ─────────────────────────────────────────────

// Index route — serves public/index.html
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// EXAMPLE: add more routes like this
// app.get("/projects", (_req, res) => {
//   res.sendFile(path.join(__dirname, "..", "public", "projects.html"));
// });

// app.get("/about", (_req, res) => {
//   res.sendFile(path.join(__dirname, "..", "public", "about.html"));
// });

// Health check — useful for monitoring / uptime checks
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// ─────────────────────────────────────────────
// ERROR HANDLING
// ─────────────────────────────────────────────

// 404 handler — serve a custom 404 page if it exists, else plain text
app.use((_req: Request, res: Response) => {
  const custom404 = path.join(__dirname, "..", "public", "404.html");
  if (fs.existsSync(custom404)) {
    res.status(404).sendFile(custom404);
  } else {
    res.status(404).send("404 — Page not found");
  }
});

// Generic error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[server error]", err.message);
  res.status(500).send("500 — Internal Server Error");
});

// ─────────────────────────────────────────────
// START
// ─────────────────────────────────────────────
app.listen(PORT, HOST, () => {
  console.log(`[hamit.org] running on http://${HOST}:${PORT} [${NODE_ENV}]`);
});

export default app;
