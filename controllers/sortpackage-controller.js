const ParcelSort = require("../models/Sortpackagemodel");

// Fetch all sorted parcels
const getSortpackage = (req, res, next) => {
  ParcelSort.find()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

// Add a new sorted parcel
const addSortpackage = (req, res, next) => {
  const newParcel = new ParcelSort({
    description: req.body.description,
    to: req.body.to,
    from: req.body.from,
    warehouseName: req.body.warehouseName,
    trainSchedule: req.body.trainSchedule || "",
    priority: req.body.priority || "Low",
    status: req.body.status || "Pending",
    size: req.body.size || "Medium",
    stationName: req.body.stationName,
    arrivedTime: req.body.arrivedTime || "",
    dispatchedTime: req.body.dispatchedTime || "",
    damageStatus: req.body.damageStatus || "Not Damaged",
  });

  newParcel
    .save()
    .then((response) => res.json({ message: "Parcel sorted successfully!", response }))
    .catch((error) => res.json({ error }));
};

// Update a sorted parcel
const updateSortpackage = (req, res, next) => {
  const { id, trainSchedule, priority, status, size, arrivedTime, dispatchedTime, damageStatus } = req.body;

  ParcelSort.updateOne(
    { _id: id },
    {
      $set: {
        trainSchedule,
        priority,
        status,
        size,
        arrivedTime,
        dispatchedTime,
        damageStatus,
      },
    }
  )
    .then((response) => res.json({ response }))
    .catch((error) => res.json({ error }));
};

// Delete a sorted parcel
const deleteSortpackage = (req, res, next) => {
  const id = req.body.id;

  ParcelSort.deleteOne({ _id: id })
    .then(() => res.json({ message: "Sorted parcel deleted successfully!" }))
    .catch((error) => res.json({ error }));
};

module.exports = {
  getSortpackage,
  addSortpackage,
  updateSortpackage,
  deleteSortpackage,
};
