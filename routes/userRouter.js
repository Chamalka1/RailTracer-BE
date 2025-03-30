const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");

userRouter.get("/", userController.getUsers);
userRouter.post("/", userController.addUser);
userRouter.put("/", userController.updateUser);
userRouter.delete("/", userController.deleteUser);

module.exports = userRouter;
