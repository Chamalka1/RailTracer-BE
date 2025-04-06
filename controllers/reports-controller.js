const express = require("express");
const router = express.Router();
const Parcel = require("../models/Reportsmodel");
const ParcelSort = require("../models/Sortpackagemodel");

const generateReport = async (req, res) => {
  try {
    const { from, to } = req.query;
  let filter = {};
    if (from && to) {
      filter.arrivedTime = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const parcels = await ParcelSort.find(filter);

    // Group parcels by station and warehouse
    const reportMap = {};

    parcels.forEach(parcel => {
      const key = `${parcel.stationName}__${parcel.warehouseName}`;
      if (!reportMap[key]) {
        reportMap[key] = {
          stationName: parcel.stationName,
          warehouseName: parcel.warehouseName,
          sortedCount: 0,
          damagedCount: 0,
        };
      }

      if (parcel.status === "Sorted") {
        reportMap[key].sortedCount += 1;
      }

      if (parcel.damageStatus && parcel.damageStatus !== "Not Damaged") {
        reportMap[key].damagedCount += 1;
      }
    });

    const report = Object.values(reportMap);

    res.json({ message: "Report generated", report });

  } catch (error) {
    console.error("Error generating report:", error);
    res.json({ message: "An error occurred while generating the report." });
  }
};

module.exports = {generateReport};


exports.generateReport = generateReport;
