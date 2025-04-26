const express = require("express");
const packageRouter = express.Router();
const packageController = require("../controllers/packageController");

packageRouter.get("/", packageController.getPackages);
packageRouter.post("/", packageController.addPackage);
packageRouter.put("/:packageId", packageController.updatePackage);
packageRouter.delete("/:packageId", packageController.deletePackage);

module.exports = packageRouter;
