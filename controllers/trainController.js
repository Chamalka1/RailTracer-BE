const Train = require("../models/Train");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all trains
// @route   GET /api/v1/trains
// @access  Public
exports.getTrains = asyncHandler(async (req, res, next) => {
  const trains = await Train.find();
  res.status(200).json(trains); // Return array directly
});

// @desc    Get single train
// @route   GET /api/v1/trains/:id
// @access  Public
exports.getTrain = asyncHandler(async (req, res, next) => {
  const train = await Train.findById(req.params.id);

  if (!train) {
    return next(
      new ErrorResponse(`Train not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json(train);
});

// @desc    Create new train
// @route   POST /api/v1/trains
// @access  Private (Admin/RailwayAdmin)
exports.createTrain = asyncHandler(async (req, res, next) => {
  // Check if train number already exists
  const existingTrain = await Train.findOne({
    trainNumber: req.body.trainNumber,
  });
  if (existingTrain) {
    return next(
      new ErrorResponse(
        `Train with number ${req.body.trainNumber} already exists`,
        400
      )
    );
  }

  const train = await Train.create(req.body);
  res.status(201).json(train);
});

// @desc    Update train
// @route   PUT /api/v1/trains/:id
// @access  Private (Admin/RailwayAdmin)
exports.updateTrain = asyncHandler(async (req, res, next) => {
  let train = await Train.findById(req.params.id);

  if (!train) {
    return next(
      new ErrorResponse(`Train not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if updating train number and if it already exists
  if (req.body.trainNumber && req.body.trainNumber !== train.trainNumber) {
    const existingTrain = await Train.findOne({
      trainNumber: req.body.trainNumber,
    });
    if (existingTrain) {
      return next(
        new ErrorResponse(
          `Train with number ${req.body.trainNumber} already exists`,
          400
        )
      );
    }
  }

  train = await Train.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(train);
});

// @desc    Delete train
// @route   DELETE /api/v1/trains/:id
// @access  Private (Admin/RailwayAdmin)
exports.deleteTrain = asyncHandler(async (req, res, next) => {
  const train = await Train.findById(req.params.id);

  if (!train) {
    return next(
      new ErrorResponse(`Train not found with id of ${req.params.id}`, 404)
    );
  }

  await train.deleteOne();

  res.status(200).json({
    message: "Train deleted successfully",
  });
});

// @desc    Search trains
// @route   GET /api/v1/trains/search
// @access  Public
exports.searchTrains = asyncHandler(async (req, res, next) => {
  const { source, destination, date, type } = req.query;

  const query = {};

  if (source) query.source = new RegExp(source, "i");
  if (destination) query.destination = new RegExp(destination, "i");
  if (type) query.type = type;

  if (date) {
    const searchDate = new Date(date);
    const dayOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][searchDate.getDay()];

    query.$or = [
      { schedulePattern: "daily" },
      {
        schedulePattern: "weekends",
        $and: [{ runningDays: { $in: ["Saturday", "Sunday"] } }],
      },
      { schedulePattern: "custom", runningDays: dayOfWeek },
    ];
  }

  const trains = await Train.find(query);
  res.status(200).json(trains); // Return array directly
});
