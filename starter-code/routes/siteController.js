const express  = require("express");
const siteController = express.Router();
const User     = require("../models/User");
const bcrypt   = require("bcrypt");
const bcryptSalt = 10;
const path     = require('path');
const passport = require('passport');
const debug    = require('debug')("app:auth:local");

siteController.get("/", (req, res, next) => {
  console.log(req.user);
  res.render("index", {user: req.user});
});

siteController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

siteController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    debug("User created");

    const newUser = new User({
      username,
      password: hashPass
    })
    .save()
    .then(user => res.redirect('/'))
    .catch(e => res.render("auth/signup", { message: "Something went wrong" }));

  });
});


siteController.get('/login',(req,res) =>{
  res.render('auth/login');
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.post('/logout',(req,res) =>{
  req.logout();
  res.redirect("/");
});


siteController.get("/auth/facebook", passport.authenticate("facebook"));
siteController.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/",
  failureRedirect: "/"
}));

module.exports = siteController;
