const express = require("express");
const auth = express.Router();
const { ensureAuthenticated, checkRoles} = require("../passport/auth-roles");
const passport = require("passport");

auth.get("/", (req, res, next) => {
  res.render("index");
});

auth.get("/signup", checkRoles("Boss"), (req, res, next) => {
  res.render("auth/signup", {user: req.user});
});

auth.get("/login", (req, res, next) => {
  res.render("auth/login");
});

auth.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}));

module.exports = auth;