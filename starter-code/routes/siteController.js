module.exports = siteController;
const express = require("express");
const router = express.Router();
const Boss = require("../models/Boss");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);



siteController.get("/", (req, res, next) => {
  res.render("index");
});


