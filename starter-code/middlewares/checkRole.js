module.exports = role => (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === role) {
    //Validamos el rol que tiene asignado el usuario
    next()
  } else {
    res.redirect('/login')
  }
}
