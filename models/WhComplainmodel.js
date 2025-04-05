const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WhcomplainSchema = new Schema({
    complaintID: {type: String, required: true },
    parcelID: {type: String, required:true },
    complaindescription: { type: String, required: true },
    date: { type: String, required: true},
    priority: { type: String, enum: ["Low","Medium","High"], default: "Low"},
    status: { type: String, enum: ["Open", "Closed"], default: "Open"},
});

const Whcomplain = mongoose.model("Whcomplain", WhcomplainSchema);
module.exports = Whcomplain;
