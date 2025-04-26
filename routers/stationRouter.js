const express = require("express");
const stationRouter = express.Router();
const stationController = require("../controllers/stationController");
const { authenticateToken } = require("../controllers/authController");

// Protect all routes
stationRouter.use(authenticateToken);

stationRouter.get("/", stationController.getStations);
stationRouter.post("/", stationController.addStation);
stationRouter.put("/:id", stationController.updateStation);
stationRouter.delete("/:id", stationController.deleteStation);

module.exports = stationRouter;
