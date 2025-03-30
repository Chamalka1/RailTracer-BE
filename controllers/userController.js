const User = require("../models/UserModel");

const getUsers = (req, res, next) => {
  User.find()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const addUser = (req, res, next) => {
  const newUser = new User({
    nic: req.body.nic,
    name: req.body.name,
    role: req.body.role,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
  });

  newUser
    .save()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const updateUser = (req, res, next) => {
  const { nic, name, role, phoneNumber, email } = req.body;
  User.findByIdAndUpdate(id, {
    $set: {
      nic: nic,
      name: name,
      role: role,
      phoneNumber: phoneNumber,
      email: email,
    },
  })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const deleteUser = (req, res, next) => {
  const nic = req.body.nic;
  User.deleteOne({ nic: nic })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

exports.getUsers = getUsers;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
