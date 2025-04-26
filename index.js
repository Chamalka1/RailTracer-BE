const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routers/userRouter");
const packageRouter = require("./routers/pacakageRouter");
const stationRouter = require("./routers/stationRouter");
const complainRouter = require("./routers/complainRouter");
const trainRouter = require("./routers/trainRouter");
const authRoutes = require("./routers/authRoutes");
const { initializeAdmin } = require("./controllers/authController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes); // Auth routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/packages", packageRouter);
app.use("/api/v1/stations", stationRouter);
app.use("/api/v1/complains", complainRouter);
app.use("/api/v1/trains", trainRouter);

// MongoDB Connection
const uri =
  "mongodb+srv://RailTracer:eVrja2iKvdmK2atm@railtracer.9jr7v.mongodb.net/?retryWrites=true&w=majority&appName=RailTracer";

mongoose
  .connect(uri, {
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
