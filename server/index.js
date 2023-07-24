const cors = require("cors");
const express = require("express");
const app = express();
const port = 5000;
const pool = require("./db");
//middleWare
app.use(cors());
app.use(express.json()); //req.body

// Routes//

// create a todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      `INSERT INTO todo (description) VALUES($1) RETURNING*`,
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.log("error from index.js:", error.message);
  }
});

// get all todo
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (error) {
    console.log("error :", error.message);
  }
});

//get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query(`SELECT * FROM todo WHERE todo_id = ${id}`);
    // const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
    //   id,
    // ]);

    res.json(todo.rows[0]);
  } catch (error) {
    console.log("error :", error.message);
  }
});

//update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id =$2",
      [description, id]
    );
    // For some reason this isnt working ==> error : syntax error at or near "Henlo"
    // const updateTodo = await pool.query(
    //   `UPDATE todo SET description = ${description} WHERE todo_id =${id}`
    // );
    res.json("Todo was updated!");
  } catch (error) {
    console.log("error :", error.message);
  }
});

//delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      `DELETE FROM todo WHERE todo_id = ${id}`
    );
    res.json("Todo was deleted");
  } catch (error) {
    console.log("error :", error.message);
  }
});

app.listen(5000, () => {
  console.log(`Example app listening on port ${port}`);
});
