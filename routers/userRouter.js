const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../controllers/authController");

// Protect all user routes
userRouter.use(authenticateToken);

// User routes
userRouter.get("/", userController.getUsers);
userRouter.post("/", userController.addUser);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;
