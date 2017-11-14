const express = require("express");
const profilesController = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

profilesController.get("/home", (req, res) => {
  res.render("passport/private", { user: req.user });
});

profilesController.get("/list" , (req, res) => {
  //EXCLUDE BOSSs
  User.find({ role: { $ne: "BOSS" } }, 'username', (err, users) => {
    res.render('user/list', { users: users });
  });
});

profilesController.get("/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id, (err, user) => {
    res.render("user/profile", { user: user });
  });
});

profilesController.get("/edit/:id" , (req, res) => {
  res.render("user/edit", { user: req.user });
});

profilesController.post("/edit/:id", (req, res) => {
  let id = req.params.id;

  const updates = {
    username: req.body.username,
    name: req.body.name,
    familyName: req.body.familyName,
    role: req.body.role
  };

  User.findByIdAndUpdate(id, updates, (err, movie) => {
    if (err){ return next(err); }

    return res.redirect('/profile/home');
  });
});

module.exports = profilesController;
