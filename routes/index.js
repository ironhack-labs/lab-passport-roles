const express = require('express');
const router = express.Router();
const User = require("../models/User");
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function (req, res) {
    // Successful authentication, redirect home.
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username,
      password: hashPass,
      role: "STUDENT",
    });
    newUser.save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });

module.exports = router;
