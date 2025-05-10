const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  acceptParcel,
  getParcelByTracking,
  getAllParcels,
  updateParcelStatus,
  updateParcel,
  deleteParcel,
  assignParcelToTrain,
  updateParcelToTransit,
  updateParcelToReachedDestination,
  updateParcelToDelivered,
  getParcelsByStatus,
  getUnassignedParcels,
} = require("../controllers/parcelController");

router.route("/tracking/:trackingNumber").get(getParcelByTracking);
// All routes require authentication
router.use(protect);

// Routes available to all authenticated users

router.route("/status/:status").get(getParcelsByStatus);

// Routes restricted to customer support role
router
  .route("/")
  .get(authorize("customerSupport", "admin", "warehouse"), getAllParcels)
  .post(authorize("customerSupport"), acceptParcel);

router
  .route("/:id/status")
  .put(authorize("customerSupport", "admin"), updateParcelStatus);

router
  .route("/:id")
  .put(authorize("customerSupport", "admin"), updateParcel)
  .delete(authorize("customerSupport", "admin"), deleteParcel);

// Routes restricted to warehouse role
router
  .route("/unassigned")
  .get(authorize("warehouse", "admin"), getUnassignedParcels);

router
  .route("/:id/assign")
  .put(authorize("warehouse", "admin"), assignParcelToTrain);

router
  .route("/:id/transit")
  .put(authorize("warehouse", "admin"), updateParcelToTransit);

router
  .route("/:id/reached-destination")
  .put(authorize("warehouse", "admin"), updateParcelToReachedDestination);

router
  .route("/:id/deliver")
  .put(authorize("warehouse", "admin"), updateParcelToDelivered);

module.exports = router;
