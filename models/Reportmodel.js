const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the report schema
const reportSchema = new Schema({
  reportId: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },  
  parcels: [{
    parcelId: { type: String, required: true },
    description: { type: String, required: true },
    to: { type: String, required: true },
    from: { type: String, required: true },
    trainSchedule: { type: String, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    status: { type: String, enum: ["Sorted", "Pending", "In Transit"], required: true },
  }],
  
});

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
