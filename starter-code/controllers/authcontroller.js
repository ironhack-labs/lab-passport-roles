const User = require('../models/User')
const Course = require('../models/Course')
exports.loginForm = (req, res, next) =>{
    res.render('auth/login',)
  }

exports.login = (req,res, next) => {
  if(req.user.role === 'BOSS'){
    res.redirect('/profile')
  } else if (req.user.role ==='TA'){
    res.redirect('/staffprofile')
  } else{
    res.redirect('/login')
  }
}

exports.profile = async(req,res,next)=>{
  const allUsers = await User.find()
  res.render('auth/profile', {allUsers}) //, {user: req.user}
}

exports.staffprofile = async(req,res,next)=>{
const user = await User.findById(req.user._id)
const allCourses = await Course.find()
res.render('auth/staffprofile', {user, allCourses}) //, {user: req.user}
}

exports.logout =(req, res, next)=>{
  req.logout()
  res.redirect('login')
}
