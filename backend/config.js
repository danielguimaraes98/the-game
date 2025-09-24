// backend/config.js
import dotenv from "dotenv";
dotenv.config(); // Load .env (only once)

export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpiration: process.env.TOKEN_EXPIRATION || "1h",
  cookieMaxAge: process.env.COOKIE_MAXAGE || 3600000,
  corsOrigins: process.env.CORS_ORIGINS?.split(",") || ["http://127.0.0.1:3000"],
};
