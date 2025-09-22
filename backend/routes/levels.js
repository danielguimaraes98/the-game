// backend/routes/levels.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db.js";
import { User } from "../models/User.js";

export const levelsRouter = express.Router();

// Resolve __dirname (em ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- GET: servir ficheiro do nível ----------------
levelsRouter.get("/:level", requireAuth, async (req, res) => {
  const requested = parseInt(req.params.level, 10);
  const user = await User.findById(req.user.id);

  if (user.role !== "admin" && requested > user.level) {
    return res.status(403).send("🚫 Nice try… this level is still locked!");
  }

  const filePath = path.join(
    __dirname,
    "../../frontend/levels",
    `level${requested}`,
    `level${requested}.html`
  );

    // impede que o browser guarde em cache páginas de níveis
  res.set("Cache-Control", "no-store");

  res.sendFile(filePath);
});

// ---------------- POST: validar código e avançar ----------------
levelsRouter.post("/:level/submit", requireAuth, async (req, res) => {
  const level = parseInt(req.params.level, 10);
  const { code } = req.body || {};
  if (!code) return res.status(400).json({ ok: false, message: "Code required" });

  const row = await db.get("SELECT code FROM level_codes WHERE level = ?", [level]);
  if (!row) return res.status(404).json({ ok: false, message: "Level not found" });

  if (row.code.trim().toLowerCase() !== code.trim().toLowerCase()) {
    return res.status(400).json({ ok: false, message: "Wrong code" });
  }

  // avançar progresso
  const user = await User.findById(req.user.id);
  if (level >= user.level) {
    await User.updateLevel(req.user.id, level + 1);
  }

  res.json({ ok: true, next: level + 1 });
});
