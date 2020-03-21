const checkRoles = role => {
  return (req, res, next) => {
    // console.log(req.user)
    if(req.isAuthenticated() && req.user.role === role) {
      next()
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = checkRoles