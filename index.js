const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");

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

app.use("/api/v1/users", userRouter);

app.listen(PORT, () => {
  console.log(`RailTracer is running on ${PORT}`);
});
