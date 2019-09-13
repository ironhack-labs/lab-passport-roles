const User = require('../models/User')
//const passport = require('../config/passport')

exports.getSignup = (req, res) => {
  res.render('auth/signup')
}

exports.createUser = async (req, res) => {
  try{
    const {name, lastName, role, email } = req.body
    await User.register({name, lastName, role, email}, req.body.password)
    res.redirect('/login')
  } catch (e){
    console.log(e);
    res.send('El usuario ya existe')
  }
}

exports.getLogin = (req, res) =>{
  res.render('auth/login')
}

exports.createLogin = (req, res, next) =>{
  res.redirect('/account')
}

exports.getAccount = (req, res, next) => {
  res.render("auth/account", { user: req.user })
}
