const router = require('express').Router()
const User = require('../models/User')
const passport = require('../config/passport')

router.get('/signup', (req, res, next) => {
  const config = {
    title: 'Sign Up',
    action: '/signup',
    button: 'Sign Up',
    register: true
  }
  res.render('auth/form', config)
})

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.register({ ...req.body }, req.body.password)
    console.log(user)
    res.redirect('/login')
  } catch (e) {
    console.log(e)
    res.send('El usuario ya existe')
  }
})

router.get('/login', (req, res, next) => {
  const config = {
    title: 'Login',
    action: '/login',
    button: 'Login'
  }
  res.render('auth/form', config)
})

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/profile'
  })
)

router.get('/profile', isLoggedIn, (req, res, next) => {
  res.render('auth/profile', { user: req.user })
})

router.get('/employees', isLoggedIn, (req, res, next) => {
  res.render('auth/employees', { user: req.user })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

module.exports = router
