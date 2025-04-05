const Train = require("../models/TrainModel");

const getTrains = (req, res, next) => {
  Train.find()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const addTrain = (req, res, next) => {
  const newTrain = new Train({
    trainName: req.body.trainName,
    schedule: req.body.schedule,
    returnSchedule: req.body.returnSchedule,
  });

  newTrain
    .save()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const updateTrain = (req, res, next) => {
  const id = req.params.id;
  const { trainName, schedule, returnSchedule } = req.body;
  Train.findByIdAndUpdate(id, {
    $set: {
      trainName: trainName,
      schedule: schedule,
      returnSchedule: returnSchedule,
    },
  })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const deleteTrain = (req, res, next) => {
  const id = req.params.id;
  Train.deleteOne({ _id: id })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

exports.getTrains = getTrains;
exports.addTrain = addTrain;
exports.updateTrain = updateTrain;
exports.deleteTrain = deleteTrain;
