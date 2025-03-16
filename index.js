const express = require("express");
const cors = require("cors");
const mongoose = require("mongodb");
const router = require("./router");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

const uri =
  "mongodb+srv://RailTracer:eVrja2iKvdmK2atm@railtracer.9jr7v.mongodb.net/?retryWrites=true&w=majority&appName=RailTracer";

const connect = async () => {
  try {
    await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

connect();

app.get("/", (req, res) => {
  res.send("RailTracer");
});

app.get("/abc", (req, res) => {
  let data = [
    {
      ID: "01",
      type: "electronic",
      Weight: "1500 KG",
      Ishazerdous: "Yes",
      isbreakable: "yes",
    },
    {
      ID: "02",
      type: "Wood",
      Weight: "1300 KG",
      Ishazerdous: "Yes",
      isbreakable: "yes",
    },
  ];
  res.send(data);
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`RailTracer is running on ${PORT}`);
});
