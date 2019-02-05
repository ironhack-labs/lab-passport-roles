const express = require('express');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

router.get('/login', (req, res, next) => {
  res.render('auth/login', { 'message': req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));

// Employee detail
router.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  User.findOne({ _id: userId })
    .then((user) => {
      res.render('user-details', { user });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
