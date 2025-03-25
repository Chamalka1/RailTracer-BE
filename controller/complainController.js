const Complain = require("../models/ComplainModel");

const getComplain = (req, res, next) => {
  complain
    .find()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const addComplain = (req, res, next) => {
  const newComplain = new complain({
    nic: req.body.nic,
    complainerName: req.body.complainerName,
    date: req.body,
    date,
    packageId: req.body.packageId,
    description: req.body.description,
  });

  newComplain
    .save()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const updateComplain = (req, res, next) => {
  const { nic, complainerName, date, packageId, description } = req.body;
  complain
    .updateOne(
      { id: id },
      {
        $set: {
          nic: nic,
          complainerName: complainerName,
          date: date,
          packageId: packageId,
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

const deleteComplain = (req, res, next) => {
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

exports.getComplain = getComplain;
exports.addComplain = addComplain;
exports.updateComplain = updateComplain;
exports.deletecomplain = this.deletecomplain;
S;
