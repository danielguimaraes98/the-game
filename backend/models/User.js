// backend/models/User.js
import bcrypt from "bcrypt";
import { db } from "../db.js";

export class User {
  /**
   * Create a new user with encrypted password
   * Default: role = "user", level = 1
   */
  static async create(username, password, role = "user") {
    // --- Validation (same rules as frontend) ---
    if (!password) {
      throw new Error("Password is required");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      throw new Error("Password must contain uppercase, lowercase, and number");
    }

    // --- Username required ---
    if (!username) {
      throw new Error("Username is required");
    }

    // --- Hash + store ---
    const hashed = await bcrypt.hash(password, 10);
    try {
      const stmt = await db.run(
        "INSERT INTO users (username, password, role, level) VALUES (?, ?, ?, 1)",
        [username, hashed, role]
      );
      return { id: stmt.lastID, username, role, level: 1 };
    } catch (err) {
      // sqlite UNIQUE constraint on username → já existe
      throw new Error("Username already exists");
    }
  }

  /** Find user by username */
  static findByUsername(username) {
    return db.get("SELECT * FROM users WHERE username = ?", username);
  }

  /** Find user by ID */
  static findById(id) {
    return db.get("SELECT * FROM users WHERE id = ?", id);
  }

  /** Validate password against hashed value */
  static async validatePassword(user, plainPassword) {
    return bcrypt.compare(plainPassword, user.password);
  }

  /** List basic info (for tests/debug) */
  static all() {
    return db.all("SELECT id, username, created_at FROM users");
  }

  /** List detailed info (for admin dashboard) */
  static allDetailed() {
    return db.all("SELECT id, username, role, level, created_at FROM users");
  }

  /** Delete a user by ID */
  static async delete(id) {
    return db.run("DELETE FROM users WHERE id = ?", id);
  }

  /** Reset user progress (set level = 1) */
  static async resetProgress(id) {
    return db.run("UPDATE users SET level = 1 WHERE id = ?", id);
  }

  /** Update user level */
  static async updateLevel(id, level) {
    return db.run("UPDATE users SET level = ? WHERE id = ?", [level, id]);
  }

  /** Update user password (hash applied) */
  static async updatePassword(id, newPlainPassword) {
    const hash = await bcrypt.hash(newPlainPassword, 10);
    return db.run("UPDATE users SET password = ? WHERE id = ?", [hash, id]);
  }

  /** Update user role */
  static async updateRole(id, role) {
    return db.run("UPDATE users SET role = ? WHERE id = ?", [role, id]);
  }
}
