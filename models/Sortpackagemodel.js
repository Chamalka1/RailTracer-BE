const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sortpackageSchema = new Schema({
    description: {type: String, requied: true },
    to: {type: String, reqiured: true},
    from: { type: String, required: true},
    trainSChedule: { type: String},
    priority: { type: String, enum: ["Low","Medium","High"], default: "Low"},
    status: { type: String, enum: ["Pending", "In Transit", "Dispatched"], default: "Pending"},
    size: { type: String, enum: ["Small", "Medium", "Large"]},
});

module.exports = mongoose.model("sortpackages", sortpackageSchema);
module.exports = sortpackage;
