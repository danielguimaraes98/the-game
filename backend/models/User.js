import bcrypt from "bcrypt";
import { db } from "../db.js";

export class User {
  // cria um novo utilizador com password encriptada
  static async create(username, plainPassword) {
    const hash = await bcrypt.hash(plainPassword, 10);
    await db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hash]
    );
    return this.findByUsername(username);
  }

  // encontra um user pelo username
  static findByUsername(username) {
    return db.get("SELECT * FROM users WHERE username = ?", username);
  }

  // encontra um user pelo id
  static findById(id) {
    return db.get("SELECT * FROM users WHERE id = ?", id);
  }

  // valida password (compara hash)
  static async validatePassword(user, plainPassword) {
    return bcrypt.compare(plainPassword, user.password);
  }

  // lista todos os users (só para fins de admin/teste)
  static all() {
    return db.all("SELECT id, username, created_at FROM users");
  }
}
