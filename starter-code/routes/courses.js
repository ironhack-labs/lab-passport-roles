const express = require("express");
const courses = express.Router();

const { ensureLoggedIn, ensureLoggedOut } = require("../middlewares/auth");
const passport = require("passport");

const User = require("../models/user");
const Courses = require("../models/course");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.user.role === role) {
      return next();
    } else {
      res.redirect("/login");
    }
  };
}

const checkTA = checkRoles("TA");

courses.get("/", checkTA, (req, res) => {
  res.render("ta/classlist", {
    user: req.user,
    class: req.class
  });
});

module.exports = courses;
