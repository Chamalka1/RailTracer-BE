const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["admin", "warehouse", "customerSupport", "logisticOperator"],
      required: true,
    },
    employeeId: {
      type: String,
      required: function () {
        // Only required for admin and station-master roles
        return ["admin", "station-master"].includes(this.role);
      },
    },
    department: {
      type: String,
      required: function () {
        // Only required for admin and station-master roles
        return ["admin", "station-master"].includes(this.role);
      },
    },
    contactNumber: {
      type: String,
      required: function () {
        // Only required for admin and station-master roles
        return ["admin", "station-master"].includes(this.role);
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
    },
    passwordSetupToken: {
      type: String,
      select: false,
    },
    passwordSetupExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Set name from firstName and lastName if they exist
  if (this.isModified("firstName") || this.isModified("lastName")) {
    if (this.firstName && this.lastName) {
      this.name = `${this.firstName} ${this.lastName}`;
    }
  }

  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
