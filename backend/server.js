// backend/server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import "./db.js";
import { authRouter } from "./routes/auth.js";
import { meRouter } from "./routes/me.js";
import { levelsRouter } from "./routes/levels.js";
import { adminRouter } from "./routes/admin.js";
import { config } from "./config.js";

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  })
);
app.use(express.json());

// ---------------- API ROUTES ----------------
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/auth", authRouter);
app.use("/me", meRouter);
app.use("/levels", levelsRouter);
app.use("/admin", adminRouter);

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
app.listen(config.port, () => {
  console.log(`API + Frontend running on http://localhost:${config.port}`);
});
