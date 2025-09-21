//middleware/auth.js

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function requireAuth(req, res, next) {
  const token = req.cookies.token;   // take token from cookie
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired, please login again" });
  }
}
