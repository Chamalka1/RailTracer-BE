const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stationSchema = new Schema({
  id: Number,
  stationName: String,
  stationAddress: String,
  stationContactNo: Number,
  adjacentStations: { type: [Number], default: [] },
  city: String,
});

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;