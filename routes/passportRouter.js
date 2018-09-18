
const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const checkBoss = checkRoles('BOSS');
const checkTA = checkRoles('TA');
const checkDeveloper = checkRoles('DEVELOPER');


function checkRoles(role) {
  return function (req, res, next) {
    console.log(req.user)
    if (req.isAuthenticated() && req.user.position === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

router.get('/private-page',  checkRoles('BOSS'), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get("/signup", (req, res) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const position = req.body.position;


  if (username === "" || password === "" || position === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", { message: "The username already exists" });
        return;
      }
      console.log(password)
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        position
      });

      newUser.save((err) => {
        if (err) {
          res.render("passport/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
          console.log("usersafe")
        }
      });
    })
    .catch(error => {
      next(error)
    })
});

router.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;