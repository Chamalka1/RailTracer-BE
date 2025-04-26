const Station = require("../models/StationModel");

const getStations = async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stations", error: error.message });
  }
};

const addStation = async (req, res) => {
  try {
    const newStation = new Station({
      stationCode: req.body.stationCode,
      name: req.body.name,
      city: req.body.city,
      state: req.body.state,
      platforms: req.body.platforms,
      status: req.body.status,
      facilities: req.body.facilities,
    });

    const savedStation = await newStation.save();
    res.status(201).json(savedStation);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Station code already exists" });
    }
    res
      .status(500)
      .json({ message: "Error creating station", error: error.message });
  }
};

const updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStation = await Station.findByIdAndUpdate(
      id,
      {
        stationCode: req.body.stationCode,
        name: req.body.name,
        city: req.body.city,
        state: req.body.state,
        platforms: req.body.platforms,
        status: req.body.status,
        facilities: req.body.facilities,
      },
      { new: true, runValidators: true }
    );

    if (!updatedStation) {
      return res.status(404).json({ message: "Station not found" });
    }

    res.json(updatedStation);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Station code already exists" });
    }
    res
      .status(500)
      .json({ message: "Error updating station", error: error.message });
  }
};

const deleteStation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStation = await Station.findByIdAndDelete(id);

    if (!deletedStation) {
      return res.status(404).json({ message: "Station not found" });
    }

    res.json({ message: "Station deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting station", error: error.message });
  }
};

module.exports = {
  getStations,
  addStation,
  updateStation,
  deleteStation,
};
