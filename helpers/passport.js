const passport = require("passport");
const User = require("../models/User");

//make the strategy
passport.use(User.createStrategy());

//serializers
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

module.exports = passport;