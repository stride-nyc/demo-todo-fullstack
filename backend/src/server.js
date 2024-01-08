import express from "express";

const PORT = 3000;

const app = express();

// app.use(express.json());

app.get("/", (req, res) => {
  // * Might be a health check or something
  res.send("Hello, world!");
});

export default app;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
