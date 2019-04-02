const passport = require("passport");
const User = require("../models/User");

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var name
/*
User.findOne({ name }, (err, user) => {
  if (err) {
    return (err);
  }
  return ( {session:user});
});
*/

module.exports = passport;
