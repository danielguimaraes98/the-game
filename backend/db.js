import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const db = await open({
  filename: "./database.db",  // database file
  driver: sqlite3.Database,
});

// enable foreign keys (good practice to relate with other tables in future)
await db.exec("PRAGMA foreign_keys = ON");

// create users table if not exist
await db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  level INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// create levels database
await db.exec(`
CREATE TABLE IF NOT EXISTS level_codes (
  level INTEGER PRIMARY KEY,
  code TEXT NOT NULL
);
`);

// inserir código dos niveis se ainda não existir
await db.run("INSERT OR IGNORE INTO level_codes (level, code) VALUES (1, '2019')");
await db.run("INSERT OR IGNORE INTO level_codes (level, code) VALUES (2, '42')");
await db.run("INSERT OR IGNORE INTO level_codes (level, code) VALUES (3, 'Warner Bros')");
await db.run("INSERT OR IGNORE INTO level_codes (level, code) VALUES (4, 'Oh, baby, look what you started')");

