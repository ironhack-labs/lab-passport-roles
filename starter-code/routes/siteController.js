const express = require("express");
const siteController = express.Router();

siteController.get("/", (req, res, next) => {
  console.log("req.user:", req.user);
  res.render("index", {
    user: req.user
  });
});

module.exports = siteController;
