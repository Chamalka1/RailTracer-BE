const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sortpackageSchema = new Schema({
    parcelId: {
        type: mongoose.Schema.Typres.ObjectId,
        ref : 'Parcel',
        requied: true
    },
    
    warehouseName: {type: String, required: true},
    trainSchedule: { type: String},
    priority: { type: String, enum: ["Low","Medium","High"], default: "Low"},
    status: { type: String, enum: ["Pending", "In Transit", "Dispatched"], default: "Pending"},
    size: { type: String, enum: ["Small", "Medium", "Large"]},
    stationName: { type: String, required: true},
    arrivedTime: { type: String, required: true},
    dispatchedTime: { type:String, required: true},

    
},
    { timestamps: true }
);

module.exports = mongoose.model("sortpackages", sortpackageSchema);

