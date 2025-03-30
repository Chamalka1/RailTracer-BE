const express = require("express");
const stationRouter = express.Router();
const stationController = require("../controllers/stationController");

stationRouter.get("", stationController.getStations);
stationRouter.post("", stationController.addStation);
stationRouter.put("/:staionId", stationController.updateStation);
stationRouter.delete("/:staionId", stationController.deleteStation);

module.exports = stationRouter;
