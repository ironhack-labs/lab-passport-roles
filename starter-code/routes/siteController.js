const express = require("express");
const siteController = express.Router();


siteController.get("/", (req, res, next) => {
  res.redirect("auth/signin");
});


module.exports = siteController;
