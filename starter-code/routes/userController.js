const express = require("express");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const userController = express.Router();

userController.get("/login", (req, res, next) => {
  res.render("auth/login");
});

userController.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

userController.get("/:id", (req, res, next) => {
  const profileId = req.params.id;

  User.findById(profileId, (err, user) => {
    if (err) {
      return next(err);
    }
    res.render("profile/show", { user });
  });
});

userController.get("/:id/edit", (req, res, next) => {
  let profileId = req.params.id;

    User.findById(profileId, (err, profile) => {
      if (err) {
        return next(err);
      }
      res.render("profile/edit", { profile, user: req.user });
    });
});

userController.post("/:id/edit", (req, res, next) => {
  let profileId = req.params.id;
  let salt = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(req.body.password, salt);

  const update = {
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    familyName: req.body.familyName
  };

  User.findByIdAndUpdate(profileId, update, (err, profile) => {
    if (err) {
      return next(err);
    } else {
        res.redirect(`/profile/${profileId}`);
    }

      });
});

userController.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("login");
  });
});

module.exports = userController;
