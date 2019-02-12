const express = require('express');
const router  = express.Router();
const passport = require('passport')
const User = require('../models/User')

// Session middleware
const isRole = role = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.res.redirect(`/${req.user.role}`.toLocaleLowerCase())
  }
  return next()
}

// Login
router.post('/login', passport.authenticate('local') , (req,res,next) => {
  req.app.locals.loggedUser = req.user
  return res.redirect(`/${req.user.role}`.toLocaleLowerCase())
})
// FB login
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}))

router.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
    res.redirect('/alumni')
  }
)

router.get('/alumni', (req, res, next) => {
  User.find({ role: 'ALUMNI' })
    .then(alumni => {
      res.render('alumni', { alumni })
    })
    .catch(err => {
      req.app.locals.error = err
    })
})

/* GET home page */
router.get('/', isRole, (req, res, next) => {
  res.render('index');
});



module.exports = router;
