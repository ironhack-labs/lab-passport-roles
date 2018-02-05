const passport = require("passport");
const express = require("express");
const siteController = express.Router();
const ensureLogin = require("connect-ensure-login");

siteController.get("/", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("index");
});

module.exports = siteController;
