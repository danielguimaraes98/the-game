// backend/routes/admin.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { db } from "../db.js";

export const adminRouter = express.Router();

// Resolve __dirname (for serving admin.html)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * GET /admin
 * → Serve admin dashboard (HTML)
 */
adminRouter.get("/", requireAuth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("🚫 Only admins allowed");
  }

  const filePath = path.join(__dirname, "..", "..", "frontend", "admin", "admin.html");
  res.set("Cache-Control", "no-store");
  res.sendFile(filePath);
});

// ---------------- API ----------------
// All routes below require authentication + admin role
adminRouter.use(requireAuth, requireAdmin);

/* ===============================
   USER MANAGEMENT
   =============================== */

/**
 * GET /admin/users
 * → List all users
 */
adminRouter.get("/users", async (_req, res) => {
  const users = await User.allDetailed();
  res.json(users);
});

/**
 * POST /admin/users
 * → Create a new user
 */
adminRouter.post("/users", async (req, res) => {
  const { username, password, role = "user" } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  try {
    const u = await User.create(username, password, role);
    res.status(201).json({
      id: u.id,
      username: u.username,
      role: u.role,
      level: u.level,
    });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to create user" });
  }
});

/**
 * DELETE /admin/users/:id
 */
adminRouter.delete("/users/:id", async (req, res) => {
  await User.delete(req.params.id);
  res.json({ ok: true });
});

/**
 * PATCH /admin/users/:id/reset
 */
adminRouter.patch("/users/:id/reset", async (req, res) => {
  await User.resetProgress(req.params.id);
  res.json({ ok: true });
});

/**
 * PATCH /admin/users/:id
 */
adminRouter.patch("/users/:id", async (req, res) => {
  const { level, role } = req.body || {};
  if (!level && !role) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  if (level) await User.updateLevel(req.params.id, level);
  if (role) await User.updateRole(req.params.id, role);

  res.json({ ok: true });
});

/* ===============================
   LEVEL MANAGEMENT
   =============================== */

/**
 * GET /admin/levels
 * → List all levels and their codes
 */
adminRouter.get("/levels", async (_req, res) => {
  const rows = await db.all("SELECT level, code FROM level_codes ORDER BY level ASC");
  res.json(rows);
});

/**
 * PATCH /admin/levels/:level
 * → Update the code for a specific level
 */
adminRouter.patch("/levels/:level", async (req, res) => {
  const level = parseInt(req.params.level, 10);
  const { code } = req.body || {};
  if (!code) return res.status(400).json({ message: "Code is required" });

  await db.run("UPDATE level_codes SET code = ? WHERE level = ?", [code, level]);
  res.json({ ok: true });
});

/**
 * POST /admin/levels
 * → Create a new level with a code
 */
adminRouter.post("/levels", async (req, res) => {
  const { level, code } = req.body || {};
  if (!level || !code) {
    return res.status(400).json({ message: "level and code are required" });
  }

  try {
    await db.run("INSERT INTO level_codes (level, code) VALUES (?, ?)", [level, code]);
    res.status(201).json({ ok: true });
  } catch {
    res.status(400).json({ message: "Level already exists or invalid" });
  }
});

/**
 * DELETE /admin/levels/:level
 * → Delete a level
 */
adminRouter.delete("/levels/:level", async (req, res) => {
  const level = parseInt(req.params.level, 10);
  await db.run("DELETE FROM level_codes WHERE level = ?", [level]);
  res.json({ ok: true });
});
