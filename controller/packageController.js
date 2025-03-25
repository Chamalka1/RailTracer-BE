const package = require("../models/PackageModel");

const getPackage = (req, res, next) => {
  package
    .find()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const addPackage = (req, res, next) => {
  const newPackage = new package({
    id: req.body.id,
    type: req.body.type,
    weight: req.body.weight,
    from: req.body.from,
    to: req.body.to,
    description: req.body.description,
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
  const { id, type, weight, from, to, description, packageStatus } = req.body;
  package
    .updateOne(
      { id: id },
      {
        $set: {
          type: type,
          weight: weight,
          from: from,
          to: to,
          description: description,
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

const deletePackage = (req, res, next) => {
  const id = req.body.id;

  package
    .deleteOne({ id: id })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

exports.getPackage = getPackage;
exports.addPackage = addPackage;
exports.updatePackage = updatePackage;
exports.deletePackage = deletePackage;
