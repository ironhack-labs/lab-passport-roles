const User = require('../models/User')
const passport = require('../config/passport')

exports.mostrarAddUser = (req, res, next) => {
  res.render('auth/addUser')
}
exports.formAddUser = async (req, res, next) => {
  try{
    const user = await User.register({...req.body}, req.body.password)
    console.log(user)
    res.redirect('/login')
  } catch (e) {
    console.log(e)
    res.send('El usuario ya existe')
  }
}

exports.mostrarLogin = (req, res, next) => {
  res.render('auth/login')
}

exports.formLogin = (req, res, next) => {
  res.redirect('/profile')
}

exports.proceedLogin = (req, res, next) => {
  res.render('auth/profile', {user: req.user})
}

exports.proceedLogout = (req, res, next) => {
  req.logout()
  res.redirect('/login')
}

exports.mostrarUpdateProfile = async (req, res, next) => {
  const {userid} = req.query
  const user = await User.findById(userid)

  res.render('auth/updateProfile', user)
}

exports.formUpdateProfile = async (req, res, next) => {
  const {name, lastName, password, email} = req.body
  const {userid} = req.query

  await User.findByIdAndUpdate(userid, {name, lastName, password, email})
  res.redirect('/profile')
}

