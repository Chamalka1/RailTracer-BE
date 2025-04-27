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
} = require("../controllers/parcelController");

// All routes require authentication
router.use(protect);

// Routes restricted to customer support role
router.use(authorize("customerSupport"));

// Get all parcels and create new parcel
router.route("/").get(getAllParcels).post(acceptParcel);

// Get parcel by tracking number
router.route("/tracking/:trackingNumber").get(getParcelByTracking);

// Update parcel status
router.route("/:id/status").put(updateParcelStatus);

// Update and delete parcel
router.route("/:id").put(updateParcel).delete(deleteParcel);

module.exports = router;
