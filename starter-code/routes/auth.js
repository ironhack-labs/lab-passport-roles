const express        = require("express");
const passportRouter = express.Router();
const passport = require("passport");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const app = express();

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});