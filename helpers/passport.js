const
  passport = require(`passport`),
  User     = require(`../models/User`)
;

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

module.exports = passport;