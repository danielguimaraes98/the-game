// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import "./db.js";
import { authRouter } from "./routes/auth.js";
import { meRouter } from "./routes/me.js";
import { levelsRouter } from "./routes/levels.js";
import { adminRouter } from "./routes/admin.js";

dotenv.config();

const app = express();

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") || ["http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(express.json());

// ---------------- API ROUTES ----------------
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/auth", authRouter);
app.use("/me", meRouter);
app.use("/levels", levelsRouter);
app.use("/admin", adminRouter); // 👈 API clara em /admin/api

// ---------------- FRONTEND ROUTES ----------------
app.use(
  "/",
  express.static(path.join(__dirname, "..", "frontend"), {
    index: "index.html",
    extensions: ["html"],
  })
);

// Página admin (HTML) – protegida dentro do adminRouter em vez de aqui

// ---------------- SERVER START ----------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API + Frontend running on http://localhost:${PORT}`);
});
