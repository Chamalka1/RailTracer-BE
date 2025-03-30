const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stationSchema = new Schema(
  {
    stationName: String,
    stationAddress: String,
    stationContactNo: String,
    isClosed: { type: Boolean, default: false },
    adjacentStations: [
      {
        stationId: { type: Schema.Types.ObjectId, ref: "Station" },
        name: String,
      },
    ],
    warehouses: [
      {
        warehouseId: { type: Schema.Types.ObjectId, ref: "Warehouse" },
        name: String,
      },
    ],
  },
  { timestamps: true }
);

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;
