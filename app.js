const express = require("express");
const app = express();
const cors = require("cors");
const userController = require("./controller/userController");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/users", userController.getUser);

app.post("/users", (req, res) => {
  userController.addUser(req.body, (callback) => {
    res.send(callback);
  });
});

app.put("/users", (req, res) => {
  userController.updateUser(req.body, (callback) => {
    res.send(callback);
  });
});

app.delete("/users", (req, res) => {
  userController.deleteUser(req.body, (callback) => {
    res.send(callback);
  });
});

module.exports = app;
