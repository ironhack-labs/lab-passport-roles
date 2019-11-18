const passport = require("passport");
const bcrypt = require('bcrypt');
const LocalStrategy = require("passport-local").Strategy;

const User = require('../models/User');

passport.use(
    new LocalStrategy(
      {
        passReqToCallback: true
      },
      (req, username, password, next) => {
        User.findOne(
          {
            username
          },
          (err, user) => {
            // todo: watch with mongodb stopped
            if (err) {
              return next(err);
            }
  
            if (!user) {
              return next(null, false, {
                message: "Incorrect username"
              });
            }
            if (!bcrypt.compareSync(password, user.password)) {
              return next(null, false, {
                message: "Incorrect password"
              });
            }
  
            return next(null, user);
          }
        );
      }
    )
  );

  passport.serializeUser((user, cb) => {
    console.log("serialize");
    console.log(`storing ${user._id} in the session`);
    cb(null, user._id);
    // cb(null, {id: user._id, role: user.role});
  });

  
  passport.deserializeUser((id, cb) => {
    console.log("deserialize");
    console.log(`Attaching ${id} to req.user`);
    // eslint-disable-next-line consistent-return
    User.findById(id, (err, user) => {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });
  
 

  module.exports = passport;