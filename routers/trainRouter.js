const express = require("express");
const trainRouter = express.Router();
const trainController = require("../controllers/trainController");
const { authenticateToken } = require("../controllers/authController");

// Public routes
trainRouter.get("/search", trainController.searchTrains);
trainRouter.get("/", trainController.getTrains);
trainRouter.get("/:id", trainController.getTrain);

// Protected routes
trainRouter.use(authenticateToken);

// Admin/RailwayAdmin only routes
trainRouter.use((req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "railwayAdmin") {
    return res
      .status(403)
      .json({ message: "Access denied. Admin/RailwayAdmin only." });
  }
  next();
});

trainRouter.post("/", trainController.createTrain);
trainRouter.put("/:id", trainController.updateTrain);
trainRouter.delete("/:id", trainController.deleteTrain);

module.exports = trainRouter;
