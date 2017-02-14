/* jshint esversion:6 */
const express = require("express");
const siteController = express.Router();

//user model
const User           = require("../models/user");

//bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const flash = require("connect-flash");


siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/signup", (req, res, next) => {
  res.render("signup");
});

siteController.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

 if (username === "" || password === "") {
   res.render("signup", { message: "Indicate username and password" });
   return;
 }

 User.findOne({ username }, "username", (err, user) => {
   if (user !== null) {
     res.render("signup", { message: "The username already exists" });
     return;
   }

   var salt     = bcrypt.genSaltSync(bcryptSalt);
   var hashPass = bcrypt.hashSync(password, salt);

   var newUser = User({
     username,
     password: hashPass
   });

   newUser.save((err) => {
     if (err) {
       res.render("signup", { message: "The username already exists" });
     } else {
       res.redirect("/login");
     }
   });
 });
});

siteController.get("/login", (req, res, next) => {
      res.render("login", { "message": req.flash("error") });
});

siteController.post("/login",  passport.authenticate("local", {
 successRedirect: "/private-page",
 failureRedirect: "/signup",
 failureFlash: true,
 passReqToCallback: true
}));

module.exports = siteController;
