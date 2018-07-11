/*The routes file will be defined in the routes/auth-routes.js, and we will set the necessary 
packages and code to signup in the application: */

// routes/auth-routes.js
const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const checkBoss  = checkRoles('BOSS');
const checkDeveloper = checkRoles('DEVELOPER');
const checkTa  = checkRoles('TA');
//const flash        = require ("connect-flash");
// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt-nodejs");
const bcryptSalt = 10;

//signup render
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

//login render 
authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

//logout render
authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

//ensure login 
authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(),(req, res) => {
  res.render("private-page", {user:req.user});
});
//log con face 
authRoutes.get("/auth/facebook", passport.authenticate("facebook"));
authRoutes.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/private-page",
  failureRedirect: "/"
}));

authRoutes.get("/auth/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

authRoutes.get("/auth/google/callback", passport.authenticate("google", {
  failureRedirect: "/",
  successRedirect: "/private-page"
}));
authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

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
authRoutes.get('/private-page', checkRoles('BOSS'), (req, res) => {
  res.render('private', {user: req.user});
});
authRoutes.get('/private-page', ensureAuthenticated, (req, res) => {
  res.render('private', {user: req.user});
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}


//routes login
authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  //failureFlash: true,
  passReqToCallback: true
}));



module.exports = authRoutes;