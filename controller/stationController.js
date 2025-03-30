const Station = require("../models/StationModel");

const getStations = (req, res, next) => {
  Station.find()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const addStation = (req, res, next) => {
  const newStation = new Station({
    stationName: req.body.stationName,
    stationAddress: req.body.stationAddress,
    stationContactNo: req.body.stationContactNo,
    adjacentStations: req.body.adjacentStations,
    warehouses: req.body.warehouses,
  });

  newStation
    .save()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const updateStation = (req, res, next) => {
  const id = req.params.id;
  const { stationName, stationAddress, stationContactNo } = req.body;
  Station.findByIdAndUpdate(id, {
    $set: {
      stationName: stationName,
      stationAddress: stationAddress,
      stationContactNo: stationContactNo,
    },
  })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const deleteStation = (req, res, next) => {
  const id = req.params.id;
  Station.deleteOne({ _id: id })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

exports.getStations = getStations;
exports.addStation = addStation;
exports.updateStation = updateStation;
exports.deleteStation = deleteStation;
