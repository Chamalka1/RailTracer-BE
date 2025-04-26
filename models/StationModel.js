const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stationSchema = new Schema(
  {
    stationCode: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    platforms: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["operational", "maintenance", "closed"],
      default: "operational",
    },
    facilities: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;
