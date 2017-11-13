const express = require("express");
const siteController = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
// User model
const User = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

siteController.get("/", (req, res, next) => {
  res.render("index",{user: req.user});
});

siteController.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

//login///////////////////////
siteController.get("/login", (req, res, next) => {
  res.render("passport/login",{message:req.flash("error")});
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

//signup///////////////////////////
siteController.get("/signup",ensureLogin.ensureLoggedIn(), (req, res) => {
  if (req.user.role == "Boss") res.render("passport/signup", { title: "signup",user:req.user });
});

siteController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const role = req.body.role;


  if (username === "" || password === "") {
    res.render("passport/signup", { title: "signup",message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { title: "signup",message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      name,
      familyName,
      password: hashPass,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message:"Something went wrong"});
      } else {
        res.redirect("/");
      }
    });
  });
});

siteController.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
module.exports = siteController;
