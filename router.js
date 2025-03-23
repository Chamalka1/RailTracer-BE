const express = require("express");
const router = express.Router();
const userController = require("./controller/user-controller");

router.get("/users", userController.getUser);
router.post("/users", userController.addUser);
router.put("/users", userController.updateUser);
router.delete("/users", userController.deleteUser);

module.exports = router;
