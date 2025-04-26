const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageSchema = new Schema(
  {
    weight: Number,
    deliverySender: {
      nic: String,
      name: String,
      telephone: String,
      email: String,
    },
    deliveryReciever: {
      nic: String,
      name: String,
      telephone: String,
      email: String,
    },
    from: {
      stationId: { type: Schema.Types.ObjectId, ref: "Station" },
      stationName: String,
    },
    to: {
      stationId: { type: Schema.Types.ObjectId, ref: "Station" },
      stationName: String,
    },
    isUrgent: Boolean,
    isHazardous: Boolean,
    isFragile: Boolean,
    currentLocation: { type: Schema.Types.ObjectId },
    description: String,
    packageStatus: {
      type: String,
      enum: ["RECEIVED", "WAREHOUSE", "MOVING", "DELIVERED", "DAMAGED", "LOST"],
    },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
