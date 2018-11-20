const express = require('express');
const router  = express.Router();
const passport      = require("passport");
const User         = require('../models/User');
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.post(
  "/login", passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true,
  })
);

router.get('/login', (req,res,next) => {
  res.render('auth/login');
})

router.get('/signup', (req,res,next) => {
  res.render('auth/signup');
})

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role: 'Alumni'
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/dashboard/alumniPage");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});



module.exports = router;
