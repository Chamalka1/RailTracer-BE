const express = require("express");
const router = express.Router();
const Parcel = require("../models/parcel-model"); // Import Parcel model

// Fetch parcel details by QR code
router.get("/parcels/:qrCode", async (req, res) => {
  try {
    const parcel = await Parcel.findOne({ qrCode: req.params.qrCode });
    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found" });
    }
    res.json(parcel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching parcel", error });
  }
});

// Update parcel status
router.put("/parcels/update/:id", async (req, res) => {
  const { status } = req.body;
  try {
    const updatedParcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedParcel) {
      return res.status(404).json({ message: "Parcel not found" });
    }
    res.json(updatedParcel);
  } catch (error) {
    res.status(500).json({ message: "Error updating parcel", error });
  }
});

// Get parcel counts for dashboard
router.get("/parcels/counts", async (req, res) => {
  try {
    const pendingCount = await Parcel.countDocuments({ status: "Pending" });
    const sortedCount = await Parcel.countDocuments({ status: "Sorted" });
    const dispatchedCount = await Parcel.countDocuments({ status: "Dispatched" });
    res.json({ pendingCount, sortedCount, dispatchedCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching parcel counts", error });
  }
});

module.exports = router;

/*const user = require("../models/Usermodel");

const getUser = (req, res, next) => {
  user
    .find()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const addUser = (req, res, next) => {
  const newUser = new user({
    id: req.body.id,
    name: req.body.name,
  });

  newUser
    .save()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const updateUser = (req, res, next) => {
  const { id, name } = req.body;
  user
    .updateOne({ id: id }, { $set: { name: name } })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const deleteUser = (req, res, next) => {
  const id = req.body.id;
  user
    .deleteOne({ id: id })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

exports.getUser = getUser;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;*/