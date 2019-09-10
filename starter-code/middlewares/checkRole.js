module.exports = role => {
  if (typeof role === 'string') return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) return next()
    res.redirect('/profile')
  }
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      next()
    } else {
      res.redirect('/login')
    }
  }
}