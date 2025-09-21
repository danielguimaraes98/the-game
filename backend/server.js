import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
import "./db.js"; // initialize BD

import { authRouter } from "./routes/auth.js";
import { requireAuth } from "./middleware/auth.js";
import { adminRouter } from "./routes/admin.js";

// create appp first
const app = express();

// Lê as origens do .env e transforma numa lista
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://127.0.0.1:3000"]; // fallback to dev

// middlewares
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

// rotas
app.use("/auth", authRouter);

// rota protegida
app.get("/me", requireAuth, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

app.use("/admin", adminRouter);
