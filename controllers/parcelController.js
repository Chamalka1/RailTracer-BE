const Parcel = require("../models/parcel");
const Train = require("../models/Train");
const { generateTrackingNumber } = require("../utils/trackingUtils");
const asyncHandler = require("express-async-handler");
const { validateParcelInput } = require("../utils/validations");

// Accept a new parcel
exports.acceptParcel = async (req, res) => {
  try {
    // Validate input
    const { isValid, errors } = validateParcelInput(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      weight,
      dimensions,
      description,
      sourceStation,
      destinationStation,
    } = req.body;

    // Generate unique tracking number
    const trackingNumber = await generateTrackingNumber();

    const parcel = new Parcel({
      customerName,
      customerPhone,
      customerEmail,
      weight,
      dimensions,
      description,
      sourceStation,
      destinationStation,
      trackingNumber,
      acceptedBy: req.user._id,
    });

    await parcel.save();

    res.status(201).json({
      success: true,
      data: parcel,
    });
  } catch (error) {
    console.error("Error creating parcel:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create parcel",
    });
  }
};

// Get parcel by tracking number
exports.getParcelByTracking = async (req, res) => {
  try {
    const parcel = await Parcel.findOne({
      trackingNumber: req.params.trackingNumber,
    }).populate("acceptedBy", "name email");

    if (!parcel) {
      return res.status(404).json({
        success: false,
        error: "Parcel not found",
      });
    }

    res.status(200).json({
      success: true,
      data: parcel,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all parcels (with pagination)
exports.getAllParcels = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const parcels = await Parcel.find()
      .populate("acceptedBy", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Parcel.countDocuments();

    res.status(200).json({
      success: true,
      data: parcels,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalRecords: total,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update parcel status
exports.updateParcelStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const parcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!parcel) {
      return res.status(404).json({
        success: false,
        error: "Parcel not found",
      });
    }

    res.status(200).json({
      success: true,
      data: parcel,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update parcel details
// @route   PUT /api/parcels/:id
// @access  Private/CustomerSupport
exports.updateParcel = asyncHandler(async (req, res) => {
  try {
    // Validate input
    const { isValid, errors } = validateParcelInput(req.body, true);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) {
      return res.status(404).json({
        success: false,
        error: "Parcel not found",
      });
    }

    // Update only allowed fields
    const allowedUpdates = [
      "customerName",
      "customerEmail",
      "customerPhone",
      "weight",
      "dimensions",
      "status",
      "description",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        parcel[field] = req.body[field];
      }
    });

    const updatedParcel = await parcel.save();

    res.status(200).json({
      success: true,
      data: updatedParcel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update parcel",
    });
  }
});

// @desc    Delete parcel
// @route   DELETE /api/parcels/:id
// @access  Private/CustomerSupport
exports.deleteParcel = asyncHandler(async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);

    if (!parcel) {
      return res.status(404).json({
        success: false,
        error: "Parcel not found",
      });
    }

    await parcel.deleteOne();

    res.status(200).json({
      success: true,
      message: "Parcel deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to delete parcel",
    });
  }
});

// @desc    Assign parcel to a train schedule
// @route   PUT /api/parcels/:id/assign
// @access  Private/Warehouse
exports.assignParcelToTrain = asyncHandler(async (req, res) => {
  try {
    const { trainId, scheduleId } = req.body;

    if (!trainId) {
      return res.status(400).json({
        success: false,
        error: "Train ID is required",
      });
    }

    // Find the parcel
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) {
      return res.status(404).json({
        success: false,
        error: "Parcel not found",
      });
    }

    // Check if parcel status is 'accepted'
    if (parcel.status !== "accepted") {
      return res.status(400).json({
        success: false,
        error: "Only parcels with 'accepted' status can be assigned to trains",
      });
    }

    // Find the train
    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({
        success: false,
        error: "Train not found",
      });
    }

    // Verify train route matches parcel source and destination
    if (
      train.source !== parcel.sourceStation ||
      train.destination !== parcel.destinationStation
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Train route does not match parcel source and destination stations",
      });
    }

    // Verify schedule exists if scheduleId was provided
    if (scheduleId && train.schedules && train.schedules.length > 0) {
      const scheduleExists = train.schedules.some(
        schedule => schedule._id.toString() === scheduleId || schedule._id.toString() === scheduleId.toString()
      );
      
      if (!scheduleExists) {
        return res.status(400).json({
          success: false,
          error: "The selected schedule does not exist for this train",
        });
      }

      // Find the specific schedule from the train's schedules
      const selectedSchedule = train.schedules.find(
        schedule => schedule._id.toString() === scheduleId || schedule._id.toString() === scheduleId.toString()
      );

      // Update parcel with train assignment and schedule details
      parcel.assignedTrain = trainId;
      parcel.assignedBy = req.user._id;
      parcel.assignedAt = Date.now();
      parcel.status = "assigned";
      parcel.assignedSchedule = {
        departureTime: selectedSchedule.departureTime,
        arrivalTime: selectedSchedule.arrivalTime,
        scheduleId: selectedSchedule._id
      };
    } else {
      // Update parcel with train assignment details (without specific schedule)
      parcel.assignedTrain = trainId;
      parcel.assignedBy = req.user._id;
      parcel.assignedAt = Date.now();
      parcel.status = "assigned";
    }

    const updatedParcel = await parcel.save();

    res.status(200).json({
      success: true,
      data: updatedParcel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to assign parcel to train",
    });
  }
});

// @desc    Update parcel to in-transit status
// @route   PUT /api/parcels/:id/transit
// @access  Private/Warehouse
exports.updateParcelToTransit = asyncHandler(async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) {
      return res.status(404).json({
        success: false,
        error: "Parcel not found",
      });
    }

    // Check if parcel status is 'assigned'
    if (parcel.status !== "assigned") {
      return res.status(400).json({
        success: false,
        error:
          "Only parcels with 'assigned' status can be updated to in-transit",
      });
    }

    // Update parcel status
    parcel.status = "in-transit";
    const updatedParcel = await parcel.save();

    res.status(200).json({
      success: true,
      data: updatedParcel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update parcel status",
    });
  }
});

// @desc    Update parcel to reached-destination status
// @route   PUT /api/parcels/:id/reached-destination
// @access  Private/Warehouse
exports.updateParcelToReachedDestination = asyncHandler(async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) {
      return res.status(404).json({
        success: false,
        error: "Parcel not found",
      });
    }

    // Check if parcel status is 'in-transit'
    if (parcel.status !== "in-transit") {
      return res.status(400).json({
        success: false,
        error:
          "Only parcels with 'in-transit' status can be updated to reached-destination",
      });
    }

    // Update parcel status
    parcel.status = "reached-destination";
    parcel.reachedDestinationAt = Date.now();
    const updatedParcel = await parcel.save();

    res.status(200).json({
      success: true,
      data: updatedParcel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update parcel status",
    });
  }
});

// @desc    Update parcel to delivered status
// @route   PUT /api/parcels/:id/deliver
// @access  Private/Warehouse
exports.updateParcelToDelivered = asyncHandler(async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) {
      return res.status(404).json({
        success: false,
        error: "Parcel not found",
      });
    }

    // Check if parcel status is 'reached-destination'
    if (parcel.status !== "reached-destination") {
      return res.status(400).json({
        success: false,
        error:
          "Only parcels with 'reached-destination' status can be updated to delivered",
      });
    }

    // Update parcel status
    parcel.status = "delivered";
    parcel.deliveredAt = Date.now();
    const updatedParcel = await parcel.save();

    res.status(200).json({
      success: true,
      data: updatedParcel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update parcel status",
    });
  }
});

// @desc    Get all parcels by status
// @route   GET /api/parcels/status/:status
// @access  Private
exports.getParcelsByStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.params;

    // Validate status
    const validStatuses = [
      "accepted",
      "assigned",
      "in-transit",
      "reached-destination",
      "delivered",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status parameter",
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const parcels = await Parcel.find({ status })
      .populate("acceptedBy", "name email")
      .populate("assignedBy", "name email")
      .populate("assignedTrain", "trainNumber name source destination")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Parcel.countDocuments({ status });

    res.status(200).json({
      success: true,
      data: parcels,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalRecords: total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch parcels",
    });
  }
});

// @desc    Get unassigned parcels
// @route   GET /api/parcels/unassigned
// @access  Private/Warehouse
exports.getUnassignedParcels = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const parcels = await Parcel.find({ status: "accepted" })
      .populate("acceptedBy", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Parcel.countDocuments({ status: "accepted" });

    res.status(200).json({
      success: true,
      data: parcels,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalRecords: total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch unassigned parcels",
    });
  }
});
