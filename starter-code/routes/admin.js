const express = require("express");
const admin = express.Router();

const ensureLogin   = require("connect-ensure-login");
const passport      = require("passport");

const User          = require("../models/user");

admin.get("/", (req, res, next) => {
  res.render("admin/admin-panel",
  { user: req.user });
});

admin.get("/userlist", (req, res, next) => {
  console.log("trying to access userlist");
  User.find({}, (err, users) => {
    if (err) return next(err);
    res.render("admin/userlist", {
      users
    });
  });
});

module.exports = admin;
