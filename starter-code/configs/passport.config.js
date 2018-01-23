const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;

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
};

// module.exports.getMyUsername = (id) => {
//   User.findById({_id:id}).then(user=>{

//   })
//   .catch(error => next(error));
// };

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