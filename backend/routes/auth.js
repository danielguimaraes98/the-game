import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { User } from "../models/User.js";

export const authRouter = express.Router();

// cria utilizador
authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }
  try {
    const user = await User.create(username, password);
    res.json({ message: "User registered", user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(400).json({ message: "Username already exists" });
  }
});

// POST /auth/login
authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  const user = await User.findByUsername(username);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const valid = await User.validatePassword(user, password);
  if (!valid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // cria token JWT
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ message: "Login successful", token });
});

