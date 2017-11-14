const express = require("express");
const siteController = express.Router();
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const mongoose     = require("mongoose");
const User = require("../models/user");
const Course = require("../models/course");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

siteController.get("/", ensureAuthenticated, (req, res, next) => {
  res.render("logged/portal", req.user);
});
// edit own profile
siteController.get("/edit", ensureAuthenticated, (req, res, next) => {
  res.render("logged/edit", req.user);
});

siteController.post("/edit", ensureAuthenticated, (req, res, next) =>{
  let editProfile = {
    name: req.body.name,
    familyName: req.body.familyName
  };

User.findByIdAndUpdate(req.user.id, editProfile, (err, product) => {
  if (err) {
    return next(err);
  }
  res.redirect('/portal/');
  });
});

siteController.get('/student/',ensureAuthenticatedForStudent, (req, res, next) =>{
  Course.find({}, (err, results) => {
    if (err) {
      next(err);
    }
    res.render('logged/student/listCourses', {
      results
    });
  });

});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}
function ensureAuthenticatedForStudent(req, res, next) {
  if (req.isAuthenticated() && req.user.role == "Student") {
    return next();
  } else {
    res.redirect('/portal');
  }
}

module.exports = siteController;
