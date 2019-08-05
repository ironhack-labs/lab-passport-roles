const Admin = require('../models/Admin')
const Teacher = require('../models/Teacher')

exports.getSignup = (req, res) => {
  res.render('auth/signup')
}
exports.postSignup = async (req, res) => {
  const {
    username,
    role
  } = req.body
  await Teacher.register(new Teacher({
    username
  }), role)
  res.redirect('/team')
}
exports.getLogin = (req, res) => {
  res.render('auth/login')
}
exports.postLogin = (req, res) => {
  res.redirect('/secret')
}
exports.logout = (req, res) => {
  req.logout()
  res.redirect('/')
}