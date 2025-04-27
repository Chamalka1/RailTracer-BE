const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userController = require("./controllers/userController");
const authRoutes = require("./routes/authRoutes");
const parcelRoutes = require("./routes/parcelRoutes");
const stationRoutes = require("./routes/stationRoutes");
const { initializeCustomerSupport } = require("./controllers/authController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes - v1
const apiV1 = express.Router();
app.use("/api/v1", apiV1);

apiV1.use("/auth", authRoutes);
apiV1.use("/parcels", parcelRoutes);
apiV1.use("/stations", stationRoutes);

// Legacy user routes
app.get("/users", userController.getUser);
app.post("/users", (req, res) => {
  userController.addUser(req.body, (callback) => {
    res.send(callback);
  });
});
app.put("/users", (req, res) => {
  userController.updateUser(req.body, (callback) => {
    res.send(callback);
  });
});
app.delete("/users", (req, res) => {
  userController.deleteUser(req.body, (callback) => {
    res.send(callback);
  });
});

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/railtracer", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Initialize customer support user
    initializeCustomerSupport();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.path
  });
});

const PORT = process.env.PORT || 5000;

// Check if port is in use and handle gracefully
const server = app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Please try a different port or close the application using this port.`
      );
      process.exit(1);
    } else {
      console.error("Server error:", err);
    }
  });

module.exports = app;
