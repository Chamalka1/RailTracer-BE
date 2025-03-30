const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    nic: { type: String, unique: true, required: true },
    name: String,
    role: {
      type: String,
      enum: [
        "ADMIN",
        "CUSTOMER_SUPPORT",
        "WAREHOUSE_OPERATOR",
        "LOGISTIC_OPERATOR",
        "ADMIN",
        "CUSTOMER",
      ],
    },
    phonNumber: String,
    email: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
