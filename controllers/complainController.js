const Complain = require("../models/ComplainModel");

const getComplains = (req, res, next) => {
  Complain.find()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const addComplain = (req, res, next) => {
  const newComplain = new Complain({
    user: req.body.user,
    packageId: req.body.packageId,
    complainerCategory: req.complainerCategory,
    discription: req.body.discription,
    complainStatus: req.body.complainStatus,
    logs: req.body.logs,
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
  const {
    id,
    user,
    packageId,
    complainerCategory,
    discription,
    complainStatus,
    logs,
  } = req.body;
  Complain.findByIdAndUpdate(id, {
    $set: {
      user: user,
      packageId: packageId,
      complainerCategory: complainerCategory,
      discription: discription,
      complainStatus: complainStatus,
      logs: logs,
    },
  })
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
    .deleteOne({ _id: id })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

exports.getComplains = getComplains;
exports.addComplain = addComplain;
exports.updateComplain = updateComplain;
exports.deletecomplain = deleteComplain;
