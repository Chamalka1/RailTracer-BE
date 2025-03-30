const express = require("express");
const complainRouter = express.Router();
const complainController = require("../controllers/complainController");

complainRouter.get("/", complainController.getComplains);
complainRouter.post("/", complainController.addComplain);
complainRouter.put("/", complainController.updateComplain);
complainRouter.delete("/", complainController.deletecomplain);

module.exports = complainRouter;
