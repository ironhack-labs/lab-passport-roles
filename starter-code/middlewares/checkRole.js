const passport = require('./../config/passport')


module.exports = (role) => (req,res,next) => {
if (req.isAuthenticated() && req.user.role === role){
  next()
}else{
    res.redirect('/login')
  }
}