const express = require("express");
const mainController = express.Router();

mainController.get("/", (req, res, next) => {
  console.log('Main Controller');
  res.render("index");
});

module.exports = mainController;
