const SortPackage = require("../models/Sortpackagemodel");
const Parcel = require('../models/Parcelmodel');

const getSortpackage = (req, res, next) => {
  SortPackage.find()
    .populate("parcelId")
    .then((response) => {
       res.json({ response });
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
};

const fetchParcelDetails = async (req, res,next) => {
  Parcel.find()
  .then((parcels) => {
    res.json({ parcels });
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
};

const addSortpackage = (req, res, next) => {
  const newSort = new SortPackage ({
    parcelId: req.body.parcelId,
    warehouseName: req.body.warehouseName,
    trainSchedule: req.body.trainSchedule,
    priority: req.body.priority,
    status: req.body.status,
    size: req.body.size,
    stationName: req.body.stationName,
    arrivedTime: req.body.arrivedTime,
    dispatchedTime: req.body.dispatchedTime,
    damagedStatus: req.body.damagedStatus,
  });

  newSort
  .save()
  .then((response) => {
    res.json({ response });
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
};

const updateSortpackage = (req, res, next) => {
  const id = req.params.id;
  const updateData = {
    warehouseName: req.body.warehouseName,
    trainSchedule: req.body.trainSchedule,
    priority: req.body.priority,
    status: req.body.status,
    size: req.body.size,
    stationName: req.body.stationName,
    arrivedTime: req.body.arrivedTime,
    dispatchedTime: req.body.dispatchedTime,
    damagedStatus: req.body.damagedStatus,
  };
   SortPackage.findByIdandUpdate(id, { $set: updateData }, {new: true })
   .then((response) => {
    res.json({ response });
   })
   .catch((error) => {
    res.status(500).json({ error });
   });
};

const deleteSortpackage = (req, res, next) => {
  const id = req.params.id;

  SortPackage.deleteOne({_id: id })
  .then((response) => {
    res.json({ response });
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
};

exports.getSortpackage = getSortpackage;
exports.fetchParcelDetails = fetchParcelDetails;
exports.addSortpackage = addSortpackage;
exports.updateSortpackage = updateSortpackage;
exports.deleteSortpackage = deleteSortpackage;