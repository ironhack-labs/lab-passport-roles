
const passport = require("passport");
const Users = require('../models/user');

passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });
  
passport.deserializeUser((id, cb) => {
    Users.findOne({ "_id": id }, (err, user) => {
        if (err) { return cb(err); }
        cb(null, user);
    });
});