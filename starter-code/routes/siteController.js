const express = require("express");
const siteController = express.Router();
const ensureLogin    = require("connect-ensure-login");
const Users = require('../models/user.js').user;

siteController.get("/listEmployee", ensureLogin.ensureLoggedIn("/"),(req, res, next) => {
  Users.find({}, (err, docs) => {
  if(err) {
    next();
  }
  else {
    res.render('listEmployee', {docs: docs});
    return;
  }
  });
});

module.exports = siteController;
