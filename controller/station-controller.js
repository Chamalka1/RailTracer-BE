const station = require("../models/UserModel");

const getstation = (req, res, next) => {
  station
    .find()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const addstation = (req, res, next) => {
  const newstation = new station({
    id: req.body.id,
    stationName: req.body.stationName,
    stationAddress: req.body.stationAddress,
    stationContactNo: req.body.stationContactNo,
    adjacentStations: req.body.adjacentStations,
    city: req.body.city,
  });

  newstation
    .save()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const updatestation = (req, res, next) => {
  const {
    id,
    stationName,
    stationAddress,
    stationContactNo,
    adjacentStations,
    city,
  } = req.body;
  station
    .updateOne(
      { id: id },
      {
        $set: {
          stationName: stationName,
          stationAddress: stationAddress,
          stationContactNo: stationContactNo,
          adjacentStations: adjacentStations,
          city: city,
        },
      }
    )
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const deletestation = (req, res, next) => {
  const id = req.body.id;
  station
    .deleteOne({ id: id })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

exports.getstation = getstation;
exports.addstation = addstation;
exports.updatestation = updatestation;
exports.deletestation = deletestation;
