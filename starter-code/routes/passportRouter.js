const express = require("express");
const siteController = express.Router();

const user = require("../models/user");

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const passport      = require("passport");

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

siteController.get("/signin", (req, res, next) => {
  res.render("passport/signin");
});

module.exports = siteController;
