const User = require('../models/User')

exports.getEmployeeSignUpForm = (req, res) => {
  const options = {
    action: '/employees/signup',
    title: 'Sign up',
    isSignup: true,
    isBoss: true
  }
  res.render('auth/form', options)
}

exports.getLoginForm = async (req, res) => {
  const options = {
    action: '/login',
    title:  'Log in'
  }
  res.render('auth/form', options)
}

exports.getUser = (req, res) => {
  const isEmployee = 
  req.user.role === 'BOSS' ||
  req.user.role === 'DEVELOPER' ||
  req.user.role === 'TA'

  res.render('auth/profile', { user: req.user, isEmployee})
}

exports.logInUser =  (req, res) => {
  res.redirect('/profile')
}

exports.createEmployee = async(req, res) => {
  const {name, lastname, email, role, password} = req.body
  await User.register({name, lastname, email, role}, password)
  res.redirect('/profile')
}

exports.getAllEmployees = async(req, res) => {
  const employees = await User.find()
  res.render('/employees/index', { employees })
}

exports.getEmployee = async (req, res) => {
  const employee = await User.findById(req.params.id)
  res.render('/auth/profile', employee)
}