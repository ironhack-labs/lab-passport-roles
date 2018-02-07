const express = require("express");
const siteController = express.Router();
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// User model
const User = require("../models/user");

//Function to check roles
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect("/login");
    }
  };
}

const checkBoss = checkRoles("Boss");
const checkDeveloper = checkRoles("Developer");
const checkTA = checkRoles("TA");

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.render("auth/login");
});

siteController.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

// siteController.get("/new", checkBoss, (req, res) => {
//   res.render("new");
// });

// siteController.post("/new", (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   const name = req.body.name;
//   const familyName = req.body.familyName;
//   const role = req.body.role;

//   if (username === "" || password === "") {
//     res.render("auth/signup", { message: "Indicate username and password" });
//     return;
//   }

//   User.findOne({ username }, "username", (err, user) => {
//     if (user !== null) {
//       res.render("auth/signup", { message: "The username already exists" });
//       return;
//     }

//     const salt = bcrypt.genSaltSync(bcryptSalt);
//     const hashPass = bcrypt.hashSync(password, salt);

//     const newUser = new User({
//       username: username,
//       name: name,
//       familyName: familyName,
//       password: hashPass,
//       role: role
//     });

//     newUser.save(err => {
//       if (err) {
//         res.render("new", { message: "Something went wrong" });
//       } else {
//         res.redirect("/");
//       }
//     });
//   });
// });

// siteController.get("/users", (req, res, next) => {
//   User.find({}, (err, users) => {
//     if (err) return next(err);
//     res.render("users", {
//       users
//     });
//   });
// });

// siteController.post("users/:id/delete", (req, res, next) => {
//   User.findByIdAndRemove(req.params.id, (err, user) => {
//     if (err) return next(err);
//     res.redirect("/users");
//   });
// });

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = siteController;
