const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");
const secure = require('../middlewares/secure.mid');


const passportRouter = express.Router();
const bcryptSalt = 10;

passportRouter.get('/', (req, res, next) => {
  res.render('auth/login');
});

passportRouter.post('/', passport.authenticate('local-auth', {
  successRedirect: '/admin',
  failureRedirect: '/',
  passReqToCallback: true,
  failureFlash: true,
}));

passportRouter.get("/create-employee", (req, res, next) => {
  res.render("auth/signup");
});

passportRouter.post('/create-employee', secure.checkRole('Boss'), (req, res, next) => {
  const { username, password, role } = req.body;

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Please indicate username and password' });
  }

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('auth/signup', { message: 'Username already exists' });
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role
      });

      newUser.save()
        .then(() => res.redirect('/'))
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

passportRouter.get('/admin', secure.checkRole('Boss'), (req, res, next) => {
  res.render('auth/admin', { user: req.user });
});


passportRouter.get(
  "/private",
  secure.checkLogin,
  (req, res) => {
    res.render("auth/private", { user: req.user });
  }
);

module.exports = passportRouter;