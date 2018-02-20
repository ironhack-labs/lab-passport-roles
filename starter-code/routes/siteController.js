const express = require("express");
const siteController = express.Router();

const User           = require("../models/user");

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const flash = require("connect-flash");
const salt = bcrypt.genSaltSync(bcryptSalt)


siteController.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = siteController;
