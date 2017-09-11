const passport = require('passport');
const path = require('path');

const User = require('../models/User');


passport.serializeUser((user, cb) => {
  console.log('Serialize User');
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    console.log('Deserialize User');
    cb(null, user);
  });
});
