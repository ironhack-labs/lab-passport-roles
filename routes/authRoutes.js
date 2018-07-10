const express = require('express');
const User = require('../models/User')
const bcrypt = require('bcrypt')
const router  = express.Router();
const passport = require('passport');
const bcryptSalt = 10;

/* GET home page */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup',(req, res, next) => {
  const {
    username,
    password
  } = req.body;

  User.findOne({
      username
    })
    .then(user => {
      console.log(user);
      if (user !== null) {
        throw new Error("Username Already exists");
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role: [req.body.role]
      });

      return newUser.save()
    })
    .then(user => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
      res.render("auth/signup", {
        errorMessage: err.message
      });
    })
});

router.get('/login', (req, res, next) => {  
  res.render('auth/login');
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

module.exports = router;
