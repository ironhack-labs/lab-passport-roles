const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");
const flash         = require("connect-flash");
const ensureLogin = require("connect-ensure-login");

// Models
const User      = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// Routes


authRoutes.get("/signup", checkRoles('Boss'), (req, res, next) => {
  res.render("auth/signup", {user: req.user});
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role     = req.body.empRole;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Please indicate username and password" });
    return;
  }

  User.findOne({ username:username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "Sorry, that username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass,
      role: role
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



authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/success",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

// middleware function to check the role
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

authRoutes.get('/auth/success', (req, res, next) => {
  res.render('auth/success.hbs', {user: req.user})
}) 



module.exports = authRoutes;