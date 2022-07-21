const express = require("express");
const app = express();

//welcome note
app.get("/", (req, res) => {
  res.send("Welcome to school 🙌");
});
module.exports = app;
