const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/login', (req, res, next) => {
  res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/main',
  failureRedirect: '/auth/login'
}))

module.exports = router