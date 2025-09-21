// backend/models/User.js
import bcrypt from "bcrypt";
import { db } from "../db.js";

export class User {
  /**
   * Create a new user with encrypted password
   * Default: role = "user", level = 1
   */
  static async create(username, plainPassword, role = "user", level = 1) {
    const hash = await bcrypt.hash(plainPassword, 10);
    await db.run(
      "INSERT INTO users (username, password, role, level) VALUES (?, ?, ?, ?)",
      [username, hash, role, level]
    );
    return this.findByUsername(username);
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
