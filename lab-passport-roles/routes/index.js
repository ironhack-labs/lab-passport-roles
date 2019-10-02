const express = require('express');
const router  = express.Router();
const User = require('../models/User');

const isAuth = (req, res, next) => {

  if ( req.isAuthenticated() ) return next();

  let error = 'Please log in';
  return res.render('passport/login', { error });

}

const checkRole = roles => {

  return (req, res, next) => {

    if ( roles.includes(req.user.role) ) return next();

    let error = 'You are not authorized to access this page';
    return res.render('/', { error });

  }

}

/* GET home page */
router.get('/', isAuth, (req, res, next) => {

  const { user } = req;
  res.render('index', { user });

});

router.get('/users', isAuth, checkRole(['Boss', 'Developer', 'TA']), (req, res, next) => {

  User.find()
  .then( users => {

    res.render('users/index', { users });

  })
  .catch( error => console.log(error) );

});

router.post('/users', isAuth, checkRole('Boss'), (req, res, next) => {

  const { email, password, displayName, role } = req.body;
  let error;

  if ( password !== req.body['confirm-password'] ) {
    error = 'Make sure to enter the same password';
    return res.render('users/new', { error });
  }

  if ( !email || !password ) {
    error = 'Please enter email or password';
    return res.render('users/new', { error });
  }

  User.register({ email, displayName, role }, password)
  .then( user => {
    req.login(user, err => {
      res.redirect('/users');
    });
  })
  .catch( error => res.render('users/new', { error }));

})

router.get('/users/new', isAuth, checkRole('Boss'), (req, res, next) => {

  res.render('users/new');

});

module.exports = router;
