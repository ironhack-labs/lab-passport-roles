const express = require("express");
const siteController = express.Router();
const User = require('../models/user');
const bcrypt     = require("bcrypt");
const bcryptSalt = 10;

siteController.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = siteController;
