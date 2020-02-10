const express = require('express');
const router  = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User');
const ensureLogin   = require("connect-ensure-login");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', passport.authenticate("local", {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: false,
    passReqToCallback: true
}));

router.get('/home', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find()
  .then((users) => {
    res.render('home', {allUsers: users, currentUser: req.user})
  });
});

router.post('/create-user', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const { username, password, role } = req.body;

  User.findOne({username})
    .then(user => {
      if (user !== null) {
        res.render("home");
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hash,
        role: role
      });

      newUser.save(err => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/home");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

router.post('/users/:id/delete', (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
  .then(() => res.redirect('/home'))
  .catch(err => console.log(err))
});

router.get('/users/:id/edit', (req, res, next) => {
  User.findById(req.params.id)
  .then(user => res.render('edit', user))
  .catch(err => console.log(err))
});

router.get('/users/:id', (req, res, next) => {
  User.findById(req.params.id)
  .then(user => res.render('show', user))
  .catch(err => console.log(err))
});

router.post('/users/:id', (req, res, next) => {
  User.findByIdAndUpdate({_id: req.params.id}, {username: req.body.username})
  .then(user => res.redirect('/home'))
  .catch(err => console.log(err))
});


module.exports = router;
