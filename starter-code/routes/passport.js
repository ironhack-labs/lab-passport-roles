const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

const passport = require("passport");

const checkRole = (role) => {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      next();
    } else {
      res.redirect('/login');
    }
  };
};

router.get('/signup', checkRole('Boss'), (req, res, next) => {
  res.render('passport/signup');
});

router.post('/signup', checkRole('Boss'), (req, res, next) => {
  const { username, password, role } = req.body;

  User.findOne({ username: { $eq: username } })
    .then((user) => {
      if (user) {
        res.render('passport/signup', { message: 'this username is taken' });
      } else {
        const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        User.create({ username, password: hash, role })
          .then(() => {
            res.redirect('/login');
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => console.log(error));
});

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/show-users",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

module.exports = router;
