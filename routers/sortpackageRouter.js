const express = require("express");
const router = express.Router();
const sortpackageController = require('../controllers/sortpackageController');



router.get("/parcels/fetch", control.fetchParcelDetails);


router.get("/", control.getSortpackages);              
router.post("/", control.addSortpackages);             
router.put("/:id", control.updateSortpackages);        
router.delete("/:id", control.deleteSortpackages);   

module.exports = sortpackageRouter;