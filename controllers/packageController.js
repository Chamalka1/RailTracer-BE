const Package = require("../models/PackageModel");

const getPackages = (req, res, next) => {
  Package.find()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const addPackage = (req, res, next) => {
  const newPackage = new Package({
    weight: req.body.weight,
    deliverySender: req.body.deliverySender,
    deliveryReciever: req.body.deliveryReciever,
    from: req.body.from,
    to: req.body.to,
    isUrgent: req.body.isUrgent,
    isHazardous: req.body.isHazardous,
    isFragile: req.body.isFragile,
    currentLocation: req.body.from.stationId,
    isHazardous: req.body.isHazardous,
    description: req.body.description,
    packageStatus: req.body.packageStatus,
  });

  newPackage
    .save()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const updatePackage = (req, res, next) => {
  const id = req.params.id;
  const {
    weight,
    deliverySender,
    deliveryReciever,
    from,
    to,
    description,
    packageStatus,
  } = req.body;
  Package.findByIdAndUpdate(id, {
    $set: {
      type: type,
      weight: weight,
      from: from,
      to: to,
      description: description,
    },
  })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const deletePackage = (req, res, next) => {
  const id = req.params.id;

  Package.deleteOne({ _id: id })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

exports.getPackages = getPackages;
exports.addPackage = addPackage;
exports.updatePackage = updatePackage;
exports.deletePackage = deletePackage;
