const bcrypt = require("bcrypt");
const passport = require('passport');
const User = require('../models/User');
const LocalStrategy = require("passport-local").Strategy;



passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      debug('Incorrect Username');
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      debug('Incorrect Password');
      return next(null, false, { message: "Incorrect password" });
    }
    debug('Logged in user');
    return next(null, user);
  });
}));
