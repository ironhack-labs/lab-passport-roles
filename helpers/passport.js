const passport = require('passport');
const User = require('../models/User');
const Course = require('../models/Course');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;

