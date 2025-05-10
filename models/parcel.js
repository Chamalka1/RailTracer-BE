const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema({
  // Customer Details
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },

  // Parcel Details
  weight: {
    type: Number,
    required: true,
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  description: String,

  // Station Details
  sourceStation: {
    type: String,
    required: true,
  },
  destinationStation: {
    type: String,
    required: true,
  },

  // Tracking Details
  trackingNumber: {
    type: String,
    unique: true,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "accepted",
      "assigned",
      "in-transit",
      "reached-destination",
      "delivered",
    ],
    default: "accepted",
  },

  // Support Staff Details
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Train Assignment Details
  assignedTrain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Train",
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assignedAt: {
    type: Date,
  },
  assignedSchedule: {
    departureTime: String,
    arrivalTime: String,
    scheduleId: mongoose.Schema.Types.ObjectId
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  // Delivery Timestamps
  reachedDestinationAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
});

// Update timestamp on save
parcelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Parcel", parcelSchema);
