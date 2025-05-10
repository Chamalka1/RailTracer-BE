const express = require("express");
const router = express.Router();
const {
  login,
  getCurrentUser,
  createUser,
  setupPassword,
} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/auth");

// Public routes
router.post("/login", login);
router.post("/setup-password", setupPassword);

// Protected routes
router.get("/me", protect, getCurrentUser);
router.post("/users", protect, authorize("admin", "railwayAdmin"), createUser);

module.exports = router;
