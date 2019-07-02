const User = require('../models/User')

exports.getSignup = (req,res) =>{
  res.render('auth/signup')
}

exports.postSignup = async (req,res) =>{
    const  {username, password ,role} =  req.body
    await User.register(new User({username, role }),password)    
    res.redirect('/auth/login')
}

exports.getLogin = (req,res) => {
    res.render('auth/login')

}

exports.postLogin = (req,res)=>{
  if(req.user.role === 'BOSS') {
    res.redirect('/boss/boss-page')
  }
  else{
    res.redirect('/employees')
  }
}

exports.logout = (req,res) =>{
  req.logout()
  res.redirect('/')
}

exports.newEmployee = async (req,res) =>{
  const  {username, password ,role} =  req.body
  await User.register(new User({username, role }),password)    
  res.redirect('/employees-list')
}



