const express = require("express");
const User = require("../models/user");
const siteController = express.Router();
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const flash = require("connect-flash");

//passport check roles function
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/')
    }
  }
}
//checkRoles variables

var checkBoss  = checkRoles('Boss');
var checkDeveloper = checkRoles('Developer');
var checkTA  = checkRoles('TA');

//login post
siteController.get("/", (req, res, next) => {
  res.render("index", { "message": req.flash("error")});
});

siteController.post("/", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/private",checkBoss, (req, res) => {
    res.render("private-page", { user: req.user });
});


//logout post

siteController.post("/logout", (req,res)=>{
  req.session.destroy();
  res.redirect("/")
});

module.exports = siteController;




/*
router.post("/signup", (req, res, next) => {
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

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});
*/