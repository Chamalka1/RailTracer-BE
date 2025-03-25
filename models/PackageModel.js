const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageSchema = new Schema({
  id: Number,
  type: String,
  weight: Number,
  from: Number,
  to: Number,
  currentWearhouse: Number,
  discription: String,
  packageStatus: { type: String, default: "RECEIVED" },
});

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
