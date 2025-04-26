const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userController = require("./controllers/userController");
const authRoutes = require("./routers/authRoutes");
const { initializeAdmin } = require("./controllers/authController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Routes
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/railtracer", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Initialize admin user
    initializeAdmin();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
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
