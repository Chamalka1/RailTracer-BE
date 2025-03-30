const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const complainSchema = new Schema(
  {
    user: {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      name: String,
      nic: String,
      email: String,
      phonNumber: String,
    },
    packageId: Schema.Types.ObjectId,
    complainerCategory: { type: String, enum: ["DAMAGE", "LOST", "OTHER"] },
    discription: String,
    complainStatus: {
      type: String,
      enum: ["SUMBITTED", "IN_PROGRESS", "SOLVED", "PAUSED"],
    },
    logs: [
      {
        date: Date,
        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
        description: String,
      },
    ],
  },
  { timestamps: true }
);

const Complain = mongoose.model("Complain", complainSchema);

module.exports = Complain;
