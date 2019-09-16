module.exports.userLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) next()
  else res.redirect("/")
}

module.exports.userAlreadyLogged = (req, res, next) => {
  if (req.isAuthenticated()) res.redirect("/")
  else next()
}
