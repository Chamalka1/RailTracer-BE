const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");

router.post("/reports", reportsController.createReport);
router.get("/reports",reportsController.getAllReports);
router.get("/reports/:id",reportsController.getReportById);
router.put("/reports/:id",reportsController.updateReport);
router.delete("/reports/:id",reportsController.deleteReport);
router.get("/reports/filter/:key/:value", reportsController.filterReports);
router.get("/reports/filterByDate", reportsController.filterReportsByDateRange);
router.post('/generate-pdf', reportController.generateReportPDF);

module.exports = reportsRouter;