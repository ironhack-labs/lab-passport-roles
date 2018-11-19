const express = require("express");
const passportRouter = express.Router();
const User = require("../models/user");
const Course = require('../models/Course');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");


passportRouter.get("/login", (req, res) => {
  res.render("passport/login", { message: req.flash("error") });
});

passportRouter.post( "/login",passport.authenticate("local", {
  successRedirect: "/profiles",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", {
          message: "The username already exists"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      console.log(username,password);

      const newUser = new User({
        username: username,
        password: hashPass,
       
        
      });

      newUser.save(err => {
        if (err) {
          res.render("passport/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/login");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});


passportRouter.get("/logout", ensureLogin.ensureLoggedIn(), (req, res) => {
  req.logout();
  res.redirect("/login");
});


module.exports = passportRouter;
