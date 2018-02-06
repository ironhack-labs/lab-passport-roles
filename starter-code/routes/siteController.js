const passport = require("passport");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bcryptSalt = 12;
const ensureLogin = require("connect-ensure-login");
mongoose.connect("mongodb://localhost/ibi-ironhack");
mongoose.connect("mongodb://localhost/users");

router.get("/private", (req, res, next) => {
  res.render("passport/private");
});

//perche non funziona sulla home page?
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/employees-list", (req, res) => {
  User.find({}, (err, employees) => {
    if (err) return next(err);
    res.render("employees/employees-list", {
      users: employees
    });
  });
});

router.get("/employees-new", (req, res) => {
  res.render("employees/employees-new");
});

router.post("/", (req, res, next) => {
  console.log("I'm here");
  const userInfo = {
    name: req.body.name,
    familyname: req.body.familyname,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role
  };
  const newUser = new User(userInfo);
  console.log(newUser);
  newUser.save(err => {
    if (err) return next(err);
    return res.redirect("employes/employees-list");
  });
});

router.get("/:id", (req, res, next) => {
  let userId = req.params.id;
  User.findById(userId, (err, user) => {
    if (err) return next(err);
    res.render("employees/show", {
      user: user
    });
  });
});

router.post("/:id/delete", (req, res, next) => {
  let userId = req.params.id;
  console.log("Im here");
  User.findByIdAndRemove(userId, (err, user) => {
    if (err) return next(err);
    return res.redirect("employees/employees-list");
  });
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else if (!req.isAuthenticated()) {
      console.log("I'm not logged in");
      res.render("passport/login", {
        message: "You have to login"
      });
    } else {
      console.log("I'm not the boss");
      res.render("passport/login", {
        message: "You don't have the authorisation to visit this page"
      });
    }
  };
}

module.exports = router;
