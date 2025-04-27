const Parcel = require("../models/parcel");
const { generateTrackingNumber } = require("../utils/trackingUtils");
const asyncHandler = require("express-async-handler");

// Accept a new parcel
exports.acceptParcel = async (req, res) => {
  try {
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
      acceptedBy: req.user._id, // From auth middleware
    });

    await parcel.save();

    res.status(201).json({
      success: true,
      data: parcel,
    });
  } catch (error) {
    console.error("Error creating parcel:", error);
    res.status(400).json({
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
  const parcel = await Parcel.findById(req.params.id);

  if (!parcel) {
    return res.status(404).json({
      success: false,
      error: "Parcel not found",
    });
  }

  const updatedParcel = await Parcel.findByIdAndUpdate(
    req.params.id,
    {
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerPhone,
      weight: req.body.weight,
      dimensions: req.body.dimensions,
      status: req.body.status,
      description: req.body.description,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: updatedParcel,
  });
});

// @desc    Delete parcel
// @route   DELETE /api/parcels/:id
// @access  Private/CustomerSupport
exports.deleteParcel = asyncHandler(async (req, res) => {
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
    data: {},
  });
});
