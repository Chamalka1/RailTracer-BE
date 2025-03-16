const express = require("express");
const router = express.Router();
const control = require("./controller");

router.get("/users", control.getUser);
router.post("/users", control.addUser);
router.put("/users", control.updateUser);
router.delete("/users", control.deleteUser);

module.exports = router;
