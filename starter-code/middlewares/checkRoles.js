const checkRoles = (role) => {
  return (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === role) { ///// Falta definir la función authenticated?
      return next()
    } else{
      releaseEvents.redirect('/login')
    }
}
}
module.exports = checkRoles;