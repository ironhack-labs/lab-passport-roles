module.exports.userLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  }
  else {
    res.redirect("/login")
  }
}

module.exports.userAlreadyLogged = (req, res, next) => {
  if (req.isAuthenticated()) res.redirect("/")
  else next()
}

module.exports.hasRole = (role) => {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      next()
    } else {
      res.redirect("/login")
    }
  }
}
