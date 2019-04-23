const express = require('express');
const passport = require('../handlers/passport')
const router  = express.Router();
const User = require('../models/User')
const { isLogged, checkRole } = require('../handlers/middlewares')


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  const config = { action: '/signup', title: 'Sign up' }
  res.render('sign', config)
})

router.get('/login', (req, res, next) => {
  const config = { action: '/login', title: 'Log in' }
  res.render('sign', config)
})

router.post('/signup', (req, res, next) => {
  User.register({ ...req.body, role: 'BOSS' }, req.body.password)
    .then(user => {
      res.redirect('/login')
    })
    .catch(err => {
      res.send(err)
    })
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.redirect('/login')
    req.logIn(user, err => {
      if (err) return next(err)
      req.app.locals.loggedUser = req.user
      res.redirect('/profile')
    })
  })(req, res, next)
})

router.get('/profile'/*account*/ , isLogged, (req, res, next) => res.render('profile'))

router.get('/boss', isLogged, checkRole('BOSS'), (req, res, next) => {
  res.render('boss')
})


//------------------------------------------------

//----------------------------------------------------

//router.get(
//  '/auth/facebook',
//  passport.authenticate('facebook', { scope: ['email'] })
//)
//
//router.get(
//  '/auth/facebook/callback',
//  passport.authenticate('facebook'),
//  (req, res, next) => {
//    res.send('awiwi')
//  }
//)

module.exports = router;
