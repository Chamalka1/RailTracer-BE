const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const complainSchema = new Schema({
  nic: String,
  complainerName: String,
  date: Date,
  packageId: Number,
  discription: String,
  complainStatus: { type: String, default: "RECEIVED" },
});

const Complain = mongoose.model("Complain", complainSchema);

module.exports = Complain;
