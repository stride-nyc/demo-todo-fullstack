import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";

const PORT = 3000;

const app = express();

let DB;
const DATABASE_FILE = "./MY_COOL.db";

async function connect() {
  if (!DB)
    DB = await open({
      filename: DATABASE_FILE,
      driver: sqlite3.cached.Database,
    });

  return DB;
}

async function readAllTodos() {
  const db = await connect();
  const results = await db.all("SELECT * FROM TODOs");
  return results.map((todo) => todo.description);
}

app.use(
  cors({
    origin: (origin, callback) => {
      return callback(null, true);
    },
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  // * Might be a health check or something
  res.send("Hello, world!");
});

app.get("/api/todos", async (req, res) => {
  console.log("GET /api/todos");
  const current_todos = await readAllTodos();
  res.send(current_todos);
});

app.post("/api/todos", async (req, res) => {
  console.log("POST /api/todos");
  const { todo } = req.body;
  const db = await connect();
  const stmt = await db.prepare("INSERT INTO TODOs (description) VALUES (?)");
  await stmt.run(todo);
  const current_todos = await readAllTodos();
  res.send(current_todos);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
