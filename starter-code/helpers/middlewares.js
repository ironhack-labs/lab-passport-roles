exports.isLogged = (req,res,next) =>{
  if(req.isAuthenticated) return res.redirect ('/login')
  next()
}

// 

exports.checkRole = role => (req, res, next) =>
  role !== req.user.role ? res.send('Unauthorized') : next()