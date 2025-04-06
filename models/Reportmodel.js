const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new mongoose.Schema({
  stationName: {type: String, required: true},
  warehouseName: {type: String, required: true},
  sortedParcelsCount: {type: Number, required: true, default: 0 },
  damagedParcelsCount: {type: Number, required: true,default: 0 },
  dateFrom: {type: Date, required: true },
  dateTo: {type: Date, required: true },
}, 
  {timestamps: true}
);

module.exports = mongoose.model('Report', ReportSchema);
