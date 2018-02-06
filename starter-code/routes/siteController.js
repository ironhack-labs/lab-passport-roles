const express = require("express");
const siteController = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
//const ensureLogin = require("connect-ensure-login");
const checkRoles = require("../middlewares/role")
const isLoggedIn = require('../middlewares/isLoggedIn');
const onlyMe = require('../middlewares/onlyMe');

siteController.get('/', function (req, res, next) {
  res.render('index');
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

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});


siteController.get("/login", (req, res, next) => {
  res.render("auth/login");
});

siteController.post("/login", passport.authenticate("local", {

  successRedirect: "/private",
  failureRedirect: "/auth/login"
}));

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/private', checkRoles('Boss'), (req, res) => {
  res.render('private', {user: req.user});
});

module.exports = siteController;
