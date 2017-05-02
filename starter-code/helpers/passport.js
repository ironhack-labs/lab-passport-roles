const bcrypt        = require("bcrypt");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User          = require("../models/user");
const FbStrategy    = require('passport-facebook').Strategy;
const mongoose      = require("mongoose");

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((id, cb) => {
  if(mongoose.Types.ObjectId.isValid(id)) {
    User.findOne({ "_id": id }, (err, user) => {
      if (err) { return cb(err); }
        cb(null, user);
    });
  } else {
    cb(null, id);
  }

});

// passport.serializeUser((user, cb) => {
//   cb(null, user);
// });
// passport.deserializeUser((user, cb) => {
//   cb(null, user);
// });





passport.use(new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));


passport.use(new FbStrategy({
  clientID: "408192872894889",
  clientSecret: "4427a7287727fd5d4676fd3697122932",
  callbackURL: "http://localhost:3000/auth/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {

    User.findOne({ facebookId: profile.id }, function(err, user) {
      if(err) {
        console.log(err);  // handle errors!
      }
      if (!err && user !== null) {
        done(null, user);
      } else {
        user = new User({
          facebookId: profile.id,
          name: profile.displayName,
          role: "STUDENT"
        });
        user.save(function(err) {
          if(err) {
            console.log(err);  // handle errors!
          } else {
            
            done(null, user);
          }
        });
      }
    });
  done(null, profile);
}));


module.exports = passport;