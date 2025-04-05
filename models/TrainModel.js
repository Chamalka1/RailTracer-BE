const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trainSchema = new Schema({
  trainName: { type: String, required: true },
  schedule: [
    {
      stationID: { type: Schema.Types.ObjectId, ref: "Station" },
      stationName: String,
      arrivalTime: String,
      departureTime: String,
    },
  ],
  returnSchedule: [
    {
      stationID: { type: Schema.Types.ObjectId, ref: "Station" },
      stationName: String,
      arrivalTime: String,
      departureTime: String,
    },
  ],
});

const Train = mongoose.model("Train", trainSchema);

module.exports = Train;
