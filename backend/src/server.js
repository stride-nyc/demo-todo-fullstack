import express from "express";
import cors from "cors";
import knex from 'knex';
import knexfile from "../knexfile.js";

const PORT = 4000;

const app = express();

const db = knex(knexfile.development);


async function readAllTodos() {
  const results = await db.select('*').from('todos');
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
  const current_todos = await readAllTodos();
  res.send(current_todos);
});

app.post('/api/todos', async (req, res) => {
  console.log('POST /api/todos');
  const { todo } = req.body;
  if (!todo.trim()) {
    return res.status(400).send({ error: 'Description cannot be empty' });
  }
  await db('todos').insert({ description: todo });
  const current_todos = await readAllTodos();
  res.send(current_todos);
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await db('todos').where('id', id).del();
  if (deleted) {
    res.status(200).send({ message: 'Todo deleted successfully' });
  } else {
    res.status(404).send({ error: 'Todo not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
