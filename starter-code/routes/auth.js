const express = require('express');
const passportRouter = express.Router();

const User = require('../models/User');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const passport = require('passport');

const ensureLogin = require('connect-ensure-login');

passportRouter.get('/login', (req, res) => {
  res.render('auth/login');
})