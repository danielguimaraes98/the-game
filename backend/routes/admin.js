// backend/routes/admin.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { User } from "../models/User.js";

export const adminRouter = express.Router();

// Resolve __dirname (para usar sendFile)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * GET /admin
 * → Serve o painel HTML (check role inline)
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

// Todas as rotas abaixo requerem autenticação + role admin
adminRouter.use(requireAuth, requireAdmin);

/**
 * GET /admin/users
 * → List all users with detailed info
 */
adminRouter.get("/users", async (_req, res) => {
  const users = await User.allDetailed();
  res.json(users);
});

/**
 * POST /admin/users
 * → Create a new user (default role = "user")
 * body: { username, password, role? }
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
    // forward the exact error message from User.js
    res.status(400).json({ message: err.message || "Failed to create user" });
  }
});


/**
 * DELETE /admin/users/:id
 * → Delete a user by ID
 */
adminRouter.delete("/users/:id", async (req, res) => {
  await User.delete(req.params.id);
  res.json({ ok: true });
});

/**
 * PATCH /admin/users/:id/reset
 * → Reset user progress (level = 1)
 */
adminRouter.patch("/users/:id/reset", async (req, res) => {
  await User.resetProgress(req.params.id);
  res.json({ ok: true });
});

/**
 * PATCH /admin/users/:id
 * → Update user role and/or level
 * body: { role?, level? }
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
