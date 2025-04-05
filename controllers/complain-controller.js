const Whcomplain = require("../models/WhComplainmodel");


const getComplaints = (req, res, next) => {
  Whcomplain.find()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};


const addComplaint = (req, res, next) => {
  const newComplaint = new Whcomplain({
    complaintID: req.body.complaintID,
    parcelID: req.body.parcelID,
    complaindescription: req.body.complaindescription,
    date: req.body.date,
    priority: req.body.priority || "Low", 
    status: req.body.status || "Open", 
  });

  newComplaint
    .save()
    .then((response) =>
      res.json({ message: "Complaint submitted successfully!", response })
    )
    .catch((error) => res.json({ error }));
};


const updateComplaint = (req, res, next) => {
  const { id, complaintID, parcelID, complaindescription, date, priority, status } = req.body;

  Whcomplain.updateOne(
    { _id: id },
    {
      $set: {
        complaintID,
        parcelID,
        complaindescription,
        date,
        priority,
        status,
      },
    }
  )
    .then((response) => res.json({ response }))
    .catch((error) => res.json({ error }));
};


const deleteComplaint = (req, res, next) => {
  const id = req.body.id;

  Whcomplain.deleteOne({ _id: id })
    .then(() => res.json({ message: "Complaint deleted successfully!" }))
    .catch((error) => res.json({ error }));
};

module.exports = {
  getComplaints,
  addComplaint,
  updateComplaint,
  deleteComplaint,
};

/*
exports.getSortpackage = getSortpackage;
exports.addSortpackage = addSortpackage;
exports.updateSortpackage = updateSortpackage;
exports.deleteSortpackage = deleteSortpackage;*/