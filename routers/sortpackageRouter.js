const express = require("express");
const router = express.Router();
const sortpackageController = require('../controllers/sortpackageController');

router.get("/parcels/fetch",control.fetchParcelDetails)
router.get("/sortpackages", control.getSortpackages);
router.post("/sortpackages", control.addSortpackages);
router.put("/sortpackages/:id", control.updateSortpackages);
router.delete("/sortpackages/:id", control.deleteSortpackages);

module.exports = sortpackageRouter;