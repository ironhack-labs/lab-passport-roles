exports.isLogged = (req,res,next) => {
  !req.isAuthenticated() ? res.redirect('/login') : next()
}

exports.checkRoles = role => (req, res, next) => {
  role !== req.user.role ? res.send('401 - Unauthenticated') : next()
}