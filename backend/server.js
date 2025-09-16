import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import "./db.js"; // inicializa a BD

const app = express();
app.use(cors());
app.use(express.json());

// rota de teste
app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

import { authRouter } from "./routes/auth.js";
app.use("/auth", authRouter);

import { requireAuth } from "./middleware/auth.js";
app.get("/me", requireAuth, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username });
});

