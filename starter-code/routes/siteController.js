const express = require("express");
const siteController = express.Router();

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login")

siteController.get("/employees", checkRoles('Boss'), (req, res) => {
  res.render("employees/index", {user: req.user});
});

module.exports = siteController;
