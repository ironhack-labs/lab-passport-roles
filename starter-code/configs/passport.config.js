const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;

const FBStrategy = require('passport-facebook').Strategy;

const DEFAULT_USERNAME = 'Anonymous Coward';

const FB_CLIENT_ID = "209113006321008" || process.env.FB_CLIENT_ID || '';
const FB_CLIENT_SECRET = "6e0902494ec1c08d05b9c3a8352a0402" || process.env.FB_CLIENT_SECRET || '';
const FB_CB_URL = '/auth/fb/cb';

const FB_PROVIDER = 'facebook';

module.exports.setup = (passport) => {

  passport.serializeUser((user, next) => {
    next(null, user._id);
  });

  passport.deserializeUser((id, next) => {
    User.findById(id)
      .then(user => {
        next(null, user);
      })
      .catch(error => next(error));
  });

  passport.use('local-auth', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, (username, password, next) => {
    User.findOne({
        username: username
      })
      .then(user => {
        if (!user) {
          next(null, user, {
            password: 'Invalid username or password'
          });
        } else {
          user.checkPassword(password)
            .then(match => {
              if (match) {
                next(null, user);
              } else {
                next(null, null, {
                  password: 'Invalid username or password'
                });
              }
            })
            .catch(error => next(error));
        }
      })
      .catch(error => next(error));
  }));

  passport.use('fb-auth', new FBStrategy({
    clientID: FB_CLIENT_ID,
    clientSecret: FB_CLIENT_SECRET,
    callbackURL: FB_CB_URL,
    profileFields: ['id', 'emails']
  }, authenticateOAuthUser));

  function authenticateOAuthUser(accessToken, refreshToken, profile, next) {
    let provider;
    if (profile.provider === FB_PROVIDER) {
      provider = 'facebookId';
    }
    //else if (profile.provider === GOOGLE_PROVIDER) {
    //provider = 'googleId';
    //} 
    else {
      next();
    }
    User.findOne({
        [`social.${provider}`]: profile.id
      })
      .then(user => {
        if (user) {
          next(null, user);
        } else {
          const email = profile.emails ? profile.emails[0].value : null;
          user = new User({
            username: email || DEFAULT_USERNAME,
            password: Math.random().toString(36).slice(-8), // FIXME: insecure, use secure random seed
            social: {
              [provider]: profile.id
            },
            role:'STUDENT'
          });
          // console.log
          user.save()
            .then(() => {
              next(null, user);
            })
            .catch(error => next(error));
        }
      })
      .catch(error => next(error));
  }
};

module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401);
    res.redirect('/login');
  }
};

module.exports.checkRole = (role) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.status(401);
      res.redirect('/login');
    } else if (req.user.role === role) {
      next();
    } else {
      res.status(403);
      res.render('error', {
        message: 'Forbidden',
        error: {}
      });
    }
  };
};