const { response } = require("express");
const user = require("../models/Sortpackagemodel");

const getSortpackage = (req, res, next) => {
  Parcelsort.find()
  .then((response) => {
    res.json({response});
  })
  .catch ((error) => {
    res.json({ error});
  });
};

const addSortpackage = (req, res, next) => {
  const newParcel = new ParcelSort({
    description: req.body.description,
    to: req.body.to,
    from: req.body.from,
    trainSchedule: req.body.trainSchedule || "",
    priority: req.body.priority || "Low",
    status: req.body.status || "Pending",
    size: req.body.size || "Medium",
  });

  newParcel
    .save()
    .then((response) => res.json({ message: " Parcel sorted successfully! ", response }))
    .catch((error) => res.json({ error }));
};

const updateSortpackage = (req, res, next) => {
  const { id, trainSchedule, priority, status, size } = req.body;

  ParcelSort.updateOne(
    { _id: id },
    {
      $set: {
        trainSchedule,
        priority,
        status,
        size,
      },
    }
  )
    .then((response) => res.json({ response }))
    .catch((error) => res.json({ error }));
};

//Deleting the sorted item
const deleteSortpackage = (req, res, next) => {
  const id = req.body.id;

  ParcelSort.deleteSortpackage({_id: id})
  .then(() => res.json({ message: "Sorted parcel deleted successfully!"}))
  .catch((error) => res.json({ error }));
};


exports.getSortpackage = getSortpackage;
exports.addSortpackage = addSortpackage;
exports.updateSortpackage = updateSortpackage;
exports.deleteSortpackage = deleteSortpackage;
