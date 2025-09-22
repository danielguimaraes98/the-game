// routes/me.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { User } from "../models/User.js";

export const meRouter = express.Router();

// GET /me → return user info
meRouter.get("/", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    level: user.level
  });
});

// PATCH /me/level → update progress
meRouter.patch("/level", requireAuth, async (req, res) => {
  const { level } = req.body || {};
  if (!level) {
    return res.status(400).json({ message: "Level required" });
  }

  // only allow advancing, never decreasing
  const user = await User.findById(req.user.id);
  if (level > user.level) {
    await User.updateLevel(req.user.id, level);
  }

  res.json({ ok: true });
});
