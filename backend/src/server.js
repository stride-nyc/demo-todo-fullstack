import express from "express";
import cors from "cors";
import knex from 'knex';


const PORT = 4000;

const app = express();

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './MY_COOL.db'
  },
  useNullAsDefault: true
});


async function readAllTodos() {
  const results = await db.select('*').from('todos');
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

  await db('todos').insert({ description: todo });
  const current_todos = await readAllTodos();
  res.send(current_todos);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
