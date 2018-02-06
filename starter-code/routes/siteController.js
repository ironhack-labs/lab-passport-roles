const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/ibi-ironhack");
const checkRoles = require("../middlewares/check-role");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");

const passport = require("passport");
//define roles
const checkBoss = checkRoles("Boss");
const checkDeveloper = checkRoles("Developer");
const checkTA = checkRoles("TA");

//First iteration

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/platform",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get(
  "/platform",
  checkBoss,
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    User.find({}, (err, users) => {
      if (err) return next(err);

      res.render("platform", {
        title: "Employees",
        users: users
      });
    });
  }
);

router.get("/new", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("new", {
    title: "Add an employee",
    user: {}
  });
});

router.post("/", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const userInfo = {
    name: req.body.name,
    familyName: req.body.familyName,
    role: req.body.role
  };

  const newUser = new User(userInfo);

  newUser.save(err => {
    if (newUser.errors) {
      return res.render("new", {
        title: "Add a new employee",
        errors: newUser.errors,
        user: newUser
      });
    }
    if (err) {
      return next(err);
    }
    // redirect to the list of employees if it saves
    return res.redirect("/platform");
  });
});
//show details
router.get("/:userId", (req, res, next) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) return next(err);
    res.render("show", {
      title: "Employee's details - " + user.name,
      user: user
    });
  });
});

router.post("/:id", (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      familyName: req.body.familyName,
      role: req.body.role
    },
    (err, user) => {
      if (err) return next(err);
      res.redirect(`/${req.params.id}`);
    }
  );
});

router.post("/:id/delete", (req, res, next) => {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) return next(err);
    res.redirect("/platform");
  });
});

module.exports = router;
