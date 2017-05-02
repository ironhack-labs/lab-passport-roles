// routes/auth-routes.js
const express     = require("express");
const authRoutes  = express.Router();
const passport    = require("passport");
const ensureLogin = require("connect-ensure-login");
const auth        = require("../helpers/auth");
// User model
const User        = require("../models/user");
const addUser     = require("../helpers/adduser");

// Bcrypt to encrypt passwords
const bcrypt     = require("bcrypt");
const bcryptSalt = 10;




authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  addUser(req, res, "auth/signup", "/");
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}), (req, res)=>{
  let target = "";
  switch(req.user.role) {
    case "BOSS": target = "/boss"; break;
    case "DEVELOPER": 
    case "TA": target = "/user"; break;
  }
  res.redirect(target);
});



authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});





module.exports = authRoutes;