const express             = require("express");
const User                = require("../models/User");
const Course              = require("../models/Course");
const path                = require('path');
const passport            = require("passport");
const coursesController   = express.Router();

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/error');
    }
  };
};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  };
}

// ROUTES

coursesController.get("/courses", ensureAuthenticated, (req, res) => {
  let parameters = {available: true};
  if (req.user.role == 'TA') parameters = {};
  Course.find(parameters)
        .then((data) => {
          res.render("courses", {data: data, user: req.user});
        }, (err) => {
          next(err);
        });
});

module.exports = coursesController;
