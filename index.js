const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("RailTracer");
});

app.get("/abc", (req, res) => {
  res.send("Chungi Hodai");
});

app.listen(PORT, () => {
  console.log(`Railtrace is running on ${PORT}`);
});
