const User = require('../models/User')
const passport = require('../config/passport')

exports.newUserform = (req, res) => {
  res.render('auth/newUserForm')
}

exports.newUser = async (req, res) => {
  const { name, lastName, email, role } = req.body
  await User.register({ name, lastName, email, role }, req.body.password)
  res.redirect('/login')
}

exports.loginForm = (req, res) => {
  res.render('auth/loginForm')
}

exports.loginUser = passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/profile'
})

exports.getProfile = (req, res) => {
  res.render('auth/profile')
}
