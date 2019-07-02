const User = require('../models/User')

exports.getSignup = (req, res) => {
  res.render('auth/signup')
}

exports.postSignup = async (req, res) => {
  const { username, password, role } = req.body
  await User.register(new User({ username, role }), password)
  res.redirect('/login')
}

exports.getLogin = (req, res) => {
  res.render('auth/login')
}

exports.postLogin = (req, res) => {
  if(req.user.role === 'Developer' || req.user.role === 'TA') {
   res.redirect('/employees/dashboard')
  } else {
    res.redirect('/admin/dashboard')
  }
}

exports.getLogout = (req, res) => {
  res.logout()
  res.redirect('/')
}