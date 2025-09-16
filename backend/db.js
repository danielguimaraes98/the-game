import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const db = await open({
  filename: "./database.db",  // ficheiro da base de dados
  driver: sqlite3.Database,
});

// ativar foreign keys (boa prática para relacionar tabelas no futuro)
await db.exec("PRAGMA foreign_keys = ON");

// criar tabela users se não existir
await db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);
