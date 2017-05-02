module.exports = {
  setCurrentUser: function(req,res,next) {
    if(req.isAuthenticated()) {
      res.locals.currentUser = req.user;
      res.locals.isUserLoggedIn = true;
    } else {
      res.locals.isUserLoggedIn = false;
    }
    next();
  },
  checkRoles: function(roles) {
    if(typeof roles === 'string') roles = [roles]
    return function(req, res, next) {
      if (req.isAuthenticated() && roles.find(role=>role===req.user.role)) {
        return next(); 
      } else {
        res.redirect('/login')
      }
    }
  },
  

}