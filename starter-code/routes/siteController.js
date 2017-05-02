const express = require("express");
const siteController = express.Router();
const passport = require("../helpers/passport");
const flash         = require("connect-flash");
const zxcvbn = require("zxcvbn");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../helpers/auth");
const bcryptSalt = 10;



siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/create",  auth.checkLoggedIn("/login", "Boss"), (req, res, next) => {
  res.render("auth/create");
});

siteController.post("/create", auth.checkLoggedIn("/login", "Boss"), (req, res, next) => {



  const username = req.body.username;
  const name = req.body.name;
  const password = req.body.password;
  const familyName = req.body.familyName;
  const role = req.body.role;
  const test = zxcvbn(password);

  if (username === "" || password === "") {
    res.render("auth/create", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/create", { message: "The username already exists" });
      return;
    }

  if(test.score < 1){
    res.render("auth/create", {message: test.feedback.warning + " " + test.feedback.suggestions.join(" ")});
    return;
  }
    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      password: hashPass,
      familyName,
      role,
      name,
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/create", { message: "Something went wrong" });
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
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: false,
  passReqToCallback: true
}));


siteController.get("/logout", (req, res, next)=> {
  req.logout();
  res.redirect("/login");
});


module.exports = siteController;
