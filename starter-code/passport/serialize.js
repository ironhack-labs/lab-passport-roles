const mongoose = require("mongoose");
const User = require('../models/User');
const passport = require("passport");

passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });
  
passport.deserializeUser((id, cb) => {
    User.findOne({ "_id": id }, (err, user) => {
        if (err) { return cb(err); }
        cb(null, user);
    });
});
