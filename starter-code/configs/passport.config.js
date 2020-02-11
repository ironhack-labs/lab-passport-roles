const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcrypt");
const flash = require('connect-flash')

const User = require('../models/user.model')

module.exports = app => {

  passport.serializeUser((user, next) => next(null, user._id))

  passport.deserializeUser((id, next) => {

    User.findById(id, (err, user) => {
      if (err) {
        return next(err)
      }
      next(null, user)
    });
  });

  app.use(flash())

  passport.use(new LocalStrategy({
    passReqToCallback: true
  }, (req, username, password, next) => {
    User.findOne({
      username
    }, (err, user) => {
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
    });
  }));

  // passport.use(new FacebookStrategy({
  //     clientID: '499915804267595',
  //     clientSecret: 'cee6baae6adaa882478fd4afb4bfb32a',
  //     callbackURL: "http://localhost:3000/auth/facebook/callback",
  //     profileFields: ['id', 'emails', 'displayName']
  //   },
  //   function (accessToken, refreshToken, profile, cb) {
  //     User.create({
  //       facebookId: profile.id,
  //       username: profile.displayName,
  //     }, function (err, user) {
  //       return cb(err, user);
  //     });
  //     // --
  //   }
  // ));

  passport.use(new FacebookStrategy({
      clientID: `${process.env.clientID}`,
      clientSecret: `${process.env.clientSecret}`,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ['id', 'emails', 'displayName']
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({
          facebookId: profile.id
        }, function (err, user) {
          return cb(err, user);
        })
        .then(user => {
          console.log(`USEEEER ${user}`)
          if (user) {
            if (user.facebookId == profile.id) {
              User.findOne({
                facebookId: profile.id
              }, function (err, user) {
                return cb(err, user);
              })
            }
          } else {
            User.create({
              facebookId: profile.id,
              username: profile.displayName,
            }, function (err, user) {
              return cb(err, user);
            });
          }
        })
        .catch(err => console.log(`Facebook error: ${err}`))
    }));
}