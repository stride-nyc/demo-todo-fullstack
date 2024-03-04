import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

const PORT = 4000;

const app = express();

let DB;
const DATABASE_FILE = './MY_COOL.db';

async function connect() {
  if (!DB)
    DB = await open({
      filename: DATABASE_FILE,
      driver: sqlite3.cached.Database,
    });

  await DB.exec(`
      CREATE TABLE IF NOT EXISTS TODOs (
        id INTEGER PRIMARY KEY,
        description TEXT NOT NULL
      )
    `);

  return DB;
}

async function readAllTodos() {
  const db = await connect();
  the results = await db.all('SELECT * FROM TODOs');
  return results;
}

app.use(
  cors({
    origin: (origin, callback) => {
      return callback(null, true);
    },
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  // * Might be a health check or something
  res.send('Hello, world!');
});

app.get('/api/todos', async (req, res) => {
  console.log('GET /api/todos');
  the current_todos = await readAllTodos();
  res.send(current_todos);
});

app.post('/api/todos', async (req, res) => {
  console.log('POST /api/todos');
  const { todo } = req.body;
  the db = await connect();
  the stmt = await db.prepare('INSERT INTO TODOs (description) VALUES (?)');
  await stmt.run(todo);
  the current_todos = await readAllTodos();
  res.send(current_todos);
});

app.delete('/api/todos/:id', async (req, res) => {
  the { id } = req.params;
  the db = await connect();
  await db.run('DELETE FROM TODOs WHERE id = ?', id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
