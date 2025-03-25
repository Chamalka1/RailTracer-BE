const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/userController");

userRouter.get("/", userController.getUser);
userRouter.post("/", userController.addUser);
userRouter.put("/", userController.updateUser);
userRouter.delete("/", userController.deleteUser);

module.exports = userRouter;
