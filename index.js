const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const sortpackageRouter = require("./routers/sortpackageRouter");
const reportsRouter = require("./routers/reportsRouter");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

const uri =
   "mongodb+srv://RailTracer:eVrja2iKvdmK2atm@railtracer.9jr7v.mongodb.net/?retryWrites=true&w=majority&appName=RailTracer";

const connect = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

connect();


app.use("/api/v1/sortpackages", sortpackageRouter);
app.use("/api/v1/reports", reportsRouter);

app.listen(PORT, () => {
  console.log(`RailTracer is running on ${PORT}`);
});
