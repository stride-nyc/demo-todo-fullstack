import express from "express";
import cors from "cors";

const PORT = 3000;

const app = express();

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

const CURRENT_TODOS = ["todo1", "todo2"];
app.get("/api/todos", (req, res) => {
  console.log("GET /api/todos");
  res.send(CURRENT_TODOS);
});

app.post("/api/todos", (req, res) => {
  console.log("POST /api/todos");
  const { todo } = req.body;
  CURRENT_TODOS.push(todo);
  res.send(CURRENT_TODOS);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
