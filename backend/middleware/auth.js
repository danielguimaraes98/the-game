// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { config } from "../config.js";

/**
 * Middleware: ensure a valid JWT token is provided.
 * - Extracts token from cookies
 * - Verifies token
 * - Attaches user payload to req.user
 */
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

/**
 * Middleware: ensure the user is an admin.
 * Must be used after requireAuth.
 */
export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: admin access required" });
  }
  next();
}

