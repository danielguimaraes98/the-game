//routs/auth.js

import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { User } from "../models/User.js";

export const authRouter = express.Router();

// create user
authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  try {
    const user = await User.create(username, password);
    res.json({
      message: "User registered",
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    res.status(400).json({ message: "Username already exists" });
  }
});

// POST /auth/login
authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const user = await User.findByUsername(username);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const valid = await User.validatePassword(user, password);
  if (!valid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Create token JWT
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRATION || "1h" }
  );

  // send token in cookie httpOnly insted of JSON
  res
    .cookie("token", token, {
      httpOnly: true, // não acessível por JS
      secure: true, // ⚠️ em produção precisa HTTPS
      sameSite: "Strict", // previne CSRF básico
      maxAge: parseInt(process.env.COOKIE_MAXAGE) || 1000 * 60 * 60 // 1 hora
    })
    .json({ message: "Login successful" });
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});
