const express = require("express");
const router = express.Router();
const control = require("../controllers/userController");

userRouter.get("/", userController.getUsers);
userRouter.post("/", userController.addUser);
userRouter.put("/", userController.updateUser);
userRouter.delete("/", userController.deleteUser);



module.exports = userRouter;


