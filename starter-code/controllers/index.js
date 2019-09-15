//primero hay que decirle que va a controlar
//controla al modelo 
const User = require('../models/User')


exports.logInForm = (req, res) =>{
  res.render('auth/login')
}
exports.createLogin = (req, res, next) =>{
  if(req.user.role === 'BOSS'){
    res.redirect('/account')
  }else if (req.user.role === 'TA'){
    res.redirect('/staffAccount')
  }else{
    res.redirect('login')
  }
}
exports.getAccount = (req, res, next) => {
  res.render("auth/account", { user: req.user })
  //para el usuraio que se mete vea sus datos 
}


//staff 
exports.staffprofile = (req, res, next) =>{
  res.render('auth/staffAccount')
}

exports.logOut = (req, res, next) =>{
  req.logout()
  res.redirect("/login")
}

