const passport = require('passport');
const User = require('../models/User');
require('./localStrategy');

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

module.exports = (app) =>{
  app.use(passport.initialize());
  app.use(passport.session());
};
