const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const passport = require("passport");
const bcrypt     = require("bcrypt");
const saltRounds = 10;
const pass = "111";
const salt  = bcrypt.genSaltSync(saltRounds);
const password = bcrypt.hashSync(pass, salt);
const authMiddleware = require('../authmiddleware');
// const LocalStrategy = require("passport-local").Strategy;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.get('/roleAdd', authMiddleware.isBoss, (req, res, next) => {
  res.render("auth/roleAdd");
});


// POST 

router.post('/roleAdd', (req, res, next) => {
  const {name, pass, role} = req.body;
  const newUser = new User({
    name,
    password,
    role,
  })
  newUser.save() // Create a new user and return a promise
  .then(user => { console.log('The user was created') ;
res.redirect("/")})
  .catch(err => { console.log('An error occured', err) });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: false,
  passReqToCallback: true
}));

// router.post("/login", passport.authenticate("local", {
//   successRedirect: "/private-page",
//   failureRedirect: "/login",
//   failureFlash: true,
//   passReqToCallback: true
// }));

module.exports = router;
