'use strict';

const express = require('express');
const passport = require('passport');

const User = require('../models/user.js');

const router = express.Router();

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/private-page',
  failureRedirect: '/'
}));

module.exports = router;
