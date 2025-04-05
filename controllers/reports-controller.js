const express = require("express");
const router = express.Router();
const Parcel = require("../models/parcel-model"); // Import Parcel model

const Parcel = require("../models/parcelModel"); // Import Parcel model
const LogisticsManager = require("../models/logisticsManagerModel"); // Import Logistics Manager model (if applicable)

// Generate a report of sorted parcels
exports.generateReport = async (req, res) => {
  try {
    // Fetch all sorted parcels
    const sortedParcels = await Parcel.find({ status: "Sorted" });

    if (sortedParcels.length === 0) {
      return res.status(404).json({ message: "No sorted parcels found for reporting." });
    }

    // Structure the report data
    const reportData = sortedParcels.map(parcel => ({
      parcelId: parcel.parcelId,
      description: parcel.description,
      to: parcel.to,
      from: parcel.from,
      trainSchedule: parcel.trainSchedule,
      priority: parcel.priority,
      status: parcel.status,
    }));

    res.status(200).json({
      message: "Report generated successfully",
      report: reportData,
    });

  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "An error occurred while generating the report." });
  }
};

// Notify the logistics manager
exports.notifyLogisticsManager = async (req, res) => {
  try {
    const logisticsManager = await LogisticsManager.findOne(); // Fetch logistics manager (if there's only one)
    if (!logisticsManager) {
      return res.status(404).json({ message: "Logistics Manager not found" });
    }

    // Simulated notification (In real-world applications, this could be an email or in-app notification)
    console.log(`Notification sent to logistics manager: Report of sorted parcels is available.`);

    res.status(200).json({ message: "Notification sent to the logistics manager successfully." });

  } catch (error) {
    console.error("Error notifying logistics manager:", error);
    res.status(500).json({ message: "An error occurred while sending the notification." });
  }
};

module.exports = router;
