module.exports = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next()
    } else {
      res.redirect('/auth/login')
    }
  }
}