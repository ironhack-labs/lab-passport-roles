const express = require("express");
const User = require("../models/User");
const Course = require("../models/Course");
const bcrypt = require("bcrypt");
const path = require("path");
const debug = require('debug')('starter-code:' + path.basename(__filename));
const router = express.Router();
const bcryptSalt = 10;
const flash = require("connect-flash");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      name,
      familyName,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});
console.log(flash);

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


router.get('/private', checkRoles('Boss'), (req, res) => {
  res.render('auth/private', {user: req.user});
});


  function checkRoles(role) {
    return function(req, res, next) {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      } else {
        res.redirect('/privateOther');
      }
    };
  }

router.get('/privateOther', (req, res, next) =>{

  Course.find({}, (err, listacursos) => {
      if (err) { return next(err); }
    res.render('auth/privateOther', {
      listacursos: listacursos
    });
  });

});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
