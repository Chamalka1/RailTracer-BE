const express = require("express");
const app = express();
const cors = require("cors");
const control = require("./controller");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/users", control.getUser);

app.post("/users", (req, res) => {
  control.addUser(req.body, (callback) => {
    res.send(callback);
  });
});

app.put("/users", (req, res) => {
  control.updateUser(req.body, (callback) => {
    res.send(callback);
  });
});

app.delete("/users", (req, res) => {
  control.deleteUser(req.body, (callback) => {
    res.send(callback);
  });
});

module.exports = app;
