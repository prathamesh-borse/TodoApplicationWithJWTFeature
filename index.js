const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const app = new express();

app.use(express.json());
app.use(cors());
app.use("/css", express.static(path.join(__dirname, "public/css")));
console.log("Serving static files from:", path.join(__dirname, "public/css"));

const users = [];
const todos = [];
const JWT_SECRET = "iloveyousonal";

app.get("/all", function (req, res) {
  res.status(200).json({
    todos: todos,
  });
});

app.post("/create", function (req, res) {
  const todo = req.body.todo;
  const id = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;

  todos.push({
    id: id,
    todo: todo,
  });

  console.log(todos);

  res.status(200).json({
    message: "Task saved successfully",
  });
  console.log("Create Todo: ", todos);
});

app.put("/update", function (req, res) {
  const id = parseInt(req.query.id);
  const newtodo = req.body.task;

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    res.status(404).json({
      message: "Todo not found.!",
    });
  } else {
    todos[todoIndex].todo = newtodo;
    res.status(200).json({
      message: "Todo updated successfully",
    });
  }
  console.log("Update Todo: ", todos);
});

app.delete("/delete", function (req, res) {
  const id = parseInt(req.query.id);
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  // array.splice(startIndex, deleteCount)
  // startIndex = the specified index from where you want to start modifying the array
  // deleteCount = The number of elements you want to remove from the index

  if (todoIndex === -1) {
    res.status(404).json({
      message: "Todo not found.!",
    });
  } else {
    todos.splice(todoIndex, 1);
    res.status(200).json({
      message: "Todo removed successfully",
    });
  }
  console.log("Delete Todo: ", todos);
});

app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  users.push({
    username,
    password,
  });
  console.log(users);

  res.status(200).json({
    message: "You have successfully signed up.!",
  });
});

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = users.find(
    (u) => u.username === username && u.password === password
  );

  if (existingUser) {
    const token = jwt.sign(
      {
        username: username,
        password: password,
      },
      JWT_SECRET
    );
    existingUser.token = token;

    console.log(users);

    res.status(200).json({
      message: "You have successfully signed in.!",
      token: token,
    });
  } else {
    res.status(401).json({
      message: "Invalid username or password",
    });
  }
});

app.get("/me", function (req, res) {
  const token = req.headers.authorization;
  const decodedInformation = jwt.verify(token, JWT_SECRET);
  console.log(decodedInformation);

  const foundUser = users.find(
    (u) => u.username === decodedInformation.username
  );

  if (foundUser) {
    res.status(200).json({
      username: foundUser.username,
      password: foundUser.password,
    });
  } else {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
});

app.listen("3001", () => {
  console.log("Server Started");
});
