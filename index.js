const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello from Parippu");
});

app.get("/abc", (req, res) => {
  res.send("Chungi Hodai");
});

app.listen(PORT, () => {
  console.log(`Railtrace is running on ${PORT}`);
});
