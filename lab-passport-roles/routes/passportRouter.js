const express = require('express');
const passportRouter = express.Router();
const passport = require('../helpers/passport');
const User = require('../models/User');

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login');
});


module.exports = passportRouter;