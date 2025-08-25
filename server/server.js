/**
 * NGL Clone - Modern Backend for Cybersecurity Demonstration
 *
 * This Express server replaces the old Airtable setup with a proper backend
 * that demonstrates modern attack techniques while maintaining educational value.
 *
 * EDUCATIONAL PURPOSE ONLY - For cybersecurity research and awareness.
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { RateLimiterMemory } from "rate-limiter-flexible";
import sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for demo purposes
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// Rate limiting (simulating protection that can be bypassed)
const rateLimiter = new RateLimiterMemory({
  keyGenerate: (req) => req.ip,
  points: 10, // Number of requests
  duration: 60, // Per 60 seconds
});

// SQLite database setup
const db = new sqlite3.Database("./demo_data.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Create tables for demonstration
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      user_agent TEXT,
      fingerprint TEXT,
      session_id TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS analytics (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      data TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      session_id TEXT
    )
  `);

  console.log("Database initialized");
}

// Middleware to capture user fingerprinting data (for demo)
app.use((req, res, next) => {
  req.demoFingerprint = {
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("User-Agent"),
    sessionId: req.get("X-Session-ID") || uuidv4(),
  };
  next();
});

// Analytics endpoint (demonstrates data collection)
app.post("/api/analytics", async (req, res) => {
  try {
    const { event, data } = req.body;
    const analyticsId = uuidv4();

    db.run(
      "INSERT INTO analytics (id, event_type, data, ip_address, session_id) VALUES (?, ?, ?, ?, ?)",
      [
        analyticsId,
        event,
        JSON.stringify(data),
        req.demoFingerprint.ip,
        req.demoFingerprint.sessionId,
      ],
      (err) => {
        if (err) {
          console.error("Analytics error:", err);
        }
      }
    );

    res.json({
      status: "tracked",
      message: "User interaction logged for demonstration",
      note: "This shows how sites can track user behavior",
    });
  } catch (error) {
    res.status(500).json({ error: "Analytics failed" });
  }
});

// Message submission endpoint
app.post(
  "/api/messages",
  [body("content").isLength({ min: 1, max: 500 }).trim().escape()],
  async (req, res) => {
    try {
      // Rate limiting check
      await rateLimiter.consume(req.ip);

      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { content } = req.body;
      const messageId = uuidv4();

      // Store message with fingerprinting data (demonstrates privacy violation)
      db.run(
        `INSERT INTO messages 
       (id, content, ip_address, user_agent, fingerprint, session_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
        [
          messageId,
          content,
          req.demoFingerprint.ip,
          req.demoFingerprint.userAgent,
          JSON.stringify(req.demoFingerprint),
          req.demoFingerprint.sessionId,
        ],
        (err) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to store message" });
          }

          console.log(`Message received from ${req.demoFingerprint.ip}`);

          res.json({
            status: "success",
            messageId,
            message: "Message received successfully",
          });
        }
      );
    } catch (rateLimitError) {
      res.status(429).json({
        error: "Rate limit exceeded",
        message: "Too many requests - this is a protective measure",
      });
    }
  }
);

// Admin dashboard endpoint (for demonstration purposes)
app.get("/api/admin/messages", (req, res) => {
  // In a real attack, this might be password protected or hidden
  const adminKey = req.get("X-Admin-Key");

  if (adminKey !== process.env.DEMO_ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  db.all(
    "SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50",
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      res.json({
        message: "Captured data for security demonstration",
        count: rows.length,
        data: rows,
        note: "This shows what attackers might collect",
      });
    }
  );
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "running",
    purpose: "Cybersecurity demonstration backend",
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong in the security demo",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down server...");
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Database connection closed.");
    process.exit(0);
  });
});
