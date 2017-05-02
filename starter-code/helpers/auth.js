module.exports = {
  setCurrentUser: (req, res, next)=> {
    if(req.isAuthenticated()){
      res.locals.currentUser = req.user;
      res.locals.isUserLoggedIn = true;

    } else {
      res.locals.isUserLoggedIn = false;
    }
    next();
  },

  checkLoggedIn: (redirectPath, authLevel = "User", exclusive = 0) => {

    return (req, res, next)=> {
      const roles = ['User','Ta', 'Developer', 'Boss'];

      if(req.isAuthenticated()){
        const checkLevel = roles.indexOf(authLevel);
        const currentLevel = roles.indexOf(req.user.role);
        if(exclusive)
          if(currentLevel == checkLevel) next();
          else res.redirect(redirectPath);
        else
          if(currentLevel >= checkLevel) next();
          else res.redirect(redirectPath);
      }
      else res.redirect(redirectPath);

    };
  },

};
