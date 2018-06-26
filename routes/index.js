const express = require('express');
const router  = express.Router();
const passport= require('passport');
// const flash   = require('connect-flash');

/* GET home page */
router.get('/', (req, res, next) => {
  let user;
  if(req.user) {
    user = req.user;
  }
  res.render('index', {user});
  // console.log(req.user)
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

// router.get('/login/unauth', (req, res, next) => {
//   res.render('login', {errorMessage: 'You\'re not authorized to view this page'});
// });

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login', 
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router;
