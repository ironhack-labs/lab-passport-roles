const express        = require("express");
const router         = express.Router();
const passport      = require("passport");
// User model
const User = require("../models/users");
// Bcrypt to encrypt passwords
const loggedIn = require('../middlewares/loggedIn')
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//Checking roles
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
}

const checkBoss  = checkRoles('Boss');
const checkDev = checkRoles('Developer');
const checkTA  = checkRoles('TA');

router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post("/passport/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    siteController.post("/boss", (req, res, next) => {
      const username = req.body.username;
      const name = req.body.name;
      const familyName = req.body.familyName;
      const password = req.body.password;
      const role = req.body.role;
    
      if (username === "" || password === "") {
        res.render("boss", {
          message: "Indicate username and password"
        });
        return;
      }
    });
  });

  newUser.save((err) => {
    if (err) {
      res.render("boss", {
        message: "Something went wrong"
      });
    } else {
      res.redirect("/boss");
    }
  });

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/private", loggedIn, (req, res) => {
  res.render("passport/private", { user: req.user });
});


module.exports = router;
