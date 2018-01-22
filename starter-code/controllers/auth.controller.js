const mongoose = require('mongoose');
const User = require('../models/user.model');
const passport = require('passport');

module.exports.signup = (req, res, next) => {
  res.render('auth/signup');
};

module.exports.doSignup = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    res.render('auth/signup', {
      user: {
        username: username
      },
      error: {
        username: username ? '' : 'Username is required',
        password: password ? '' : 'Password is required'
      }
    });
  } else {
    User.findOne({
        username: req.body.username
      })
      .then(user => {
        if (user != null) {
          res.render('auth/signup', {
            user: user,
            error: {
              username: 'Username already exists'
            }
          });
        } else {
          user = new User(req.body);
          user.save()
            .then(() => {
              // req.flash('info', 'Successfully sign up, now you can login!');
              // res.send("GO TO LOGIN");
              res.redirect('/login');
            }).catch(error => {
              if (error instanceof mongoose.Error.ValidationError) {
                res.render('auth/signup', {
                  user: user,
                  error: error.errors
                });
              } else {
                next(error);
              }
            });
        }
      }).catch(error => next(error));
  }
};

module.exports.login = (req, res, next) => {
  res.render('auth/login');
  //, {
      // flash: req.flash()
  //});
};