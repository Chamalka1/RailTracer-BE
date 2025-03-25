const express = require("express");
const packageRouter = express.Router();
const packageController = require("../controller/packageController");

packageRouter.get("/", packageController.getPackage);
packageRouter.post("/", packageController.addPackage);
packageRouter.put("/", packageController.updatePackage);
packageRouter.delete("/", packageController.deletePackage);

module.exports = packageRouter;
