
const mongoose = require("mongoose");
const User = require('../models/User');
const passport = require("passport");

passport.serializeUser((user, us) => {
    us(null, user._id);
  });
  
passport.deserializeUser((id, us) => {
    User.findOne({ "_id": id }, (err, user) => {
        if (err) { return us(err); }
        us(null, user);
    });
});