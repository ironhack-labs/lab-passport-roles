const passport = require("passport");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 12;
const ensureLogin = require("connect-ensure-login");

router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "You have to indicate a username and a password"
    });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    newUser = new User({
      username: username,
      password: hashPass
    });

    newUser.save(err => {
      if (err)
        res.render("passport/signup", { message: "Somethig went wrong" });
      else res.redirect("/");
    });
  });
});

router.get("/login", (req, res, next) => {
  res.render("passport/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {
//     res.redirect("/login");
//   }
// }

// function checkRoles(role) {
//   return function(req, res, next) {
//     if (req.isAuthenticated() && req.user.role === role) {
//       return next();
//     } else {
//       res.redirect (
//         "passport/login",
//         { message: "You don't have the authorisation to visit this page" }
//       );
//     }
//   };
// }

module.exports = router;
