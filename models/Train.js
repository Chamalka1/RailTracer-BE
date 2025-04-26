const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  departureTime: {
    type: String,
    required: [true, "Please add departure time"],
  },
  arrivalTime: {
    type: String,
    required: [true, "Please add arrival time"],
  },
});

const TrainSchema = new mongoose.Schema(
  {
    trainNumber: {
      type: String,
      required: [true, "Please add a train number"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please add a train name"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Please add a train type"],
      enum: ["Express", "Local", "SuperFast", "Passenger", "Freight", "Mail"],
    },
    capacity: {
      type: Number,
      required: [true, "Please add train capacity"],
      min: [1, "Capacity must be at least 1"],
    },
    source: {
      type: String,
      required: [true, "Please add source station"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "Please add destination station"],
      trim: true,
    },
    schedulePattern: {
      type: String,
      enum: ["daily", "weekends", "custom"],
      default: "daily",
    },
    runningDays: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],
    schedules: [scheduleSchema],
    status: {
      type: String,
      enum: [
        "active",
        "inactive",
        "maintenance",
        "On Time",
        "Delayed",
        "Cancelled",
        "Completed",
      ],
      default: "active",
    },
    fare: {
      type: Number,
    },
    amenities: [
      {
        type: String,
        enum: ["AC", "Non-AC", "Sleeper", "Chair Car", "Pantry", "WiFi"],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Middleware to validate schedules
TrainSchema.pre("save", function (next) {
  if (this.schedules && this.schedules.length > 0) {
    for (const schedule of this.schedules) {
      const departure = new Date(`1970-01-01T${schedule.departureTime}`);
      const arrival = new Date(`1970-01-01T${schedule.arrivalTime}`);

      if (arrival <= departure) {
        const error = new Error("Arrival time must be after departure time");
        return next(error);
      }
    }
  }
  next();
});

// Create indexes for search optimization
TrainSchema.index({ source: 1, destination: 1 });
TrainSchema.index({ trainNumber: 1 }, { unique: true });
TrainSchema.index({ status: 1 });

module.exports = mongoose.model("Train", TrainSchema);
