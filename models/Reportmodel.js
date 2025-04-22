const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new mongoose.Schema({
  reportDate: { type: Date, required: true },
  warehouseName: { type: String, required: true },
  stationName: { type: String, required: true },
  submiitedBy: { type: String, required: true },
  arrived: { type: String, required: true },
  dispatched: { type: Number, required: true },
  sorted: { type: Number, required: true },
  damaged: { type: Number, required: true },
  unsorted: { type: Number, required: true },
  arrivedTime: { type: String, required: true },
  dispatchedTime: { type: String, required: true },
  remarks: { type: String, default: "" }
}, 
  {timestamps: true}
);

const Report = mongoose.model('Report', ReportSchema);

 module.exports = Report;
