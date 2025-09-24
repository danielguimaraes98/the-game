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

  /**
   * Find a user by username
   */
  static async findByUsername(username) {
    return db.get("SELECT * FROM users WHERE username = ?", [username]);
  }

  /**
   * Find a user by ID
   */
  static async findById(id) {
    return db.get("SELECT * FROM users WHERE id = ?", [id]);
  }

  /**
   * Validate a password against stored hash
   */
  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.password);
  }

  /**
   * Get all users (basic info only)
   */
  static async all() {
    return db.all("SELECT id, username, role, level FROM users");
  }

  /**
   * Get all users with password hash included (admin/debug only)
   */
  static async allDetailed() {
    return db.all("SELECT * FROM users");
  }

  /**
   * Update a user's level
   */
  static async updateLevel(id, level) {
    await db.run("UPDATE users SET level = ? WHERE id = ?", [level, id]);
  }

  /**
   * Reset a user's progress back to level 1
   */
  static async resetProgress(id) {
    await db.run("UPDATE users SET level = 1 WHERE id = ?", [id]);
  }

  /**
   * Update a user's role
   */
  static async updateRole(id, role) {
    await db.run("UPDATE users SET role = ? WHERE id = ?", [role, id]);
  }

  /**
   * Update a user's password (with validation and hash)
   */
  static async updatePassword(id, newPassword) {
    if (!newPassword || newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      throw new Error("Password must contain uppercase, lowercase, and number");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.run("UPDATE users SET password = ? WHERE id = ?", [hashed, id]);
  }

  /**
   * Delete a user
   */
  static async delete(id) {
    await db.run("DELETE FROM users WHERE id = ?", [id]);
  }
}