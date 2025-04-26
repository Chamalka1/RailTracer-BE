const express = require("express");
const {
  getTrains,
  getTrain,
  createTrain,
  updateTrain,
  deleteTrain,
  searchTrains,
} = require("../controllers/trainController");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

// Public routes
router.get("/search", searchTrains);
router.get("/", getTrains);
router.get("/:id", getTrain);

// Protected routes (Admin/RailwayAdmin only)
router.use(protect);
router.use(authorize("admin", "railwayAdmin"));

router.post("/", createTrain);
router.put("/:id", updateTrain);
router.delete("/:id", deleteTrain);

module.exports = router;
