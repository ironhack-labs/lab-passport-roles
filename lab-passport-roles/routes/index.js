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

    const { user } = req;
    return res.render('not-authorized', { user });

  }

}

/* GET home page */
router.get('/', (req, res, next) => {

  const { user } = req;
  res.render('index', { user });

});

router.get('/users', isAuth, checkRole(['Boss', 'Developer', 'TA']), (req, res, next) => {

  const { user } = req;

  User.find()
  .then( users => {

    res.render('users/index', { user, users });

  })
  .catch( error => console.log(error) );

});

router.post('/users', isAuth, checkRole('Boss'), (req, res, next) => {

  const { user } = req;
  const { email, password, displayName, role } = req.body;
  let error;

  if ( password !== req.body['confirm-password'] ) {
    error = 'Make sure to enter the same password';
    return res.render('users/new', { user, error });
  }

  if ( !email || !password ) {
    error = 'Please enter email or password';
    return res.render('users/new', { user, error });
  }

  User.register({ email, displayName, role }, password)
  .then( user => res.redirect('/users') )
  .catch( error => res.render('users/new', { user, error }));

})

router.get('/users/new', isAuth, checkRole('Boss'), (req, res, next) => {

  const { user } = req;

  res.render('users/new', { user });

});

router.get('/users/:userId', (req, res, next) => {

  const { user } = req;
  let userId = req.params.userId;

  User.findById(userId)
  .then( foundUser => res.render('users/show', { user, foundUser }))
  .catch( error => console.log(error) );
  
})

module.exports = router;
