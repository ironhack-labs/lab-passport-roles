// routes/auth-routes.js
const express = require("express");
const authRouter = express.Router();

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport 
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const flash = require("connect-flash");

const ensureLogin = require("connect-ensure-login");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkBOSS  = checkRoles('BOSS');
const checkTA = checkRoles('TA');
const checkDEV  = checkRoles('DEV');



//GET SIGN UP PAGE
authRouter.get("/signup",checkBOSS, (req, res, next) => {
  res.render("auth/signup")
})

//POST SIGN UP PAGE
authRouter.post("/signup", checkBOSS, (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    username,
    password: hashPass
  })
  .then(() => {
    res.redirect("/");
  })
  .catch(error => {
    console.log(error);
  })
})

//GET LOG IN
authRouter.get('/login', (req, res, next) => {
  res.render('auth/login')
})

//POST LOG IN
authRouter.post('/login', passport.authenticate("local", {
  successRedirect: "/signup", 
  failureRedirect: "/login", 
  failureFlash: true, 
  passReqToCallback: true, 
}));




module.exports = authRouter;