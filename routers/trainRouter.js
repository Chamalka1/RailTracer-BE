const express = require("express");
const trainRouter = express.Router();
const trainController = require("../controllers/trainController");

trainRouter.get("/", trainController.getTrains);
trainRouter.post("/", trainController.addTrain);
trainRouter.put("/", trainController.updateTrain);
trainRouter.delete("/", trainController.deleteTrain);

module.exports = trainRouter;
