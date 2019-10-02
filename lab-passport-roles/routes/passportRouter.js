const express = require('express');
const passportRouter = express.Router();
const passport = require('../helpers/passport');
const User = require('../models/User');

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login');
});

passportRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info = {}) => {

    const { message: error } = info;

    if ( error ) return res.render('passport/login', { error });
    req.login(user, err => res.redirect('/') );
    console.log(err, user, info);
  })(req, res);

});

passportRouter.get('/facebook', passport.authenticate('facebook'));

passportRouter.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

passportRouter.post('/signup', (req, res, next) => {
  
  const { email, password } = req.body;
  let error;

  if ( password !== req.body['confirm-password'] ) {
    error = 'Make sure to enter the same password';
    return res.render('passport/signup', { error });
  }

  if ( !email || !password ) {
    error = 'Please enter email or password';
    return res.render('passport/signup', { error });
  }

  User.register({ email }, password)
  .then( user => {

    req.login( user, err => res.redirect('/'));

  })
  .catch( error => res.render('passport/signup', { error }));

});

passportRouter.get('/logout', (req, res, next) => {

  req.logout();
  res.redirect('/login');

})

module.exports = passportRouter;