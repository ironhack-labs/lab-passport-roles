const express = require("express");
const siteController = express.Router();
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get('/boss', ensureAuthenticated, (req, res) => {
  res.render('boss');
});

module.exports = siteController;
