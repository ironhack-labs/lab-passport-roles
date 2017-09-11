module.exports = {
  checkRoles: (role) => {
    return function(req, res, next) {
      if (req.isAuthenticated() && req.user.role === role) {
        return next(); 
      } else {
        res.redirect('/')
      }
    }
  },
  
  ensureAuthenticated: () => {
    return (req, res, next) => {
      if (req.isAuthenticated()) {
        return next(); 
      } else {
        res.redirect('/')
      }
    }
  }
}