const express = require("express");
const siteController = express.Router();
const { ensureAuthenticated, checkRoles } = require("../passport/auth-roles");
const User = require('../models/User');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get('/private', ensureAuthenticated, (req, res, next) => {

  if(checkRoles('Boss')){
    User.find({}).exec().then( users => {
      res.render("private/users", {users});
    }).catch(e => next(e))
  } else{
    let user = req.user
    res.redirect(`/private/users/${user._id}`, {user});
  }
});

module.exports = siteController;
