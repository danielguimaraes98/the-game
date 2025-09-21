//models/User.js

import bcrypt from "bcrypt";
import { db } from "../db.js";

export class User {
  
  // create new user with encripted password
  static async create(username, plainPassword) {
    const hash = await bcrypt.hash(plainPassword, 10);
    await db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hash]
    );
    return this.findByUsername(username);
  }

  // search user by username
  static findByUsername(username) {
    return db.get("SELECT * FROM users WHERE username = ?", username);
  }

  // search user by id
  static findById(id) {
    return db.get("SELECT * FROM users WHERE id = ?", id);
  }

  // validate password (compare hash)
  static async validatePassword(user, plainPassword) {
    return bcrypt.compare(plainPassword, user.password);
  }

  // list all users (for admin/test purposes)
  static all() {
    return db.all("SELECT id, username, created_at FROM users");
  }
}
