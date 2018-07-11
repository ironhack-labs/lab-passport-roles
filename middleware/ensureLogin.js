const ensureLoggedIn = (redirectTo) => {
  return (req, res, next) => {
      if(req.user){
          next();
      } else {
          req.flash('error', 'Error!!! You have to log in first!!!');
          res.redirect(redirectTo);
      }
  }
}

const ensureLoggedOut = (redirectTo) => {
  return (req, res, next) => {
      if(!req.user){
          next();
      } else {
          req.flash('error', 'You are logged in and cannot access the database');
          res.redirect(redirectTo);
      }
  }
}

const isBoss = (req, res, next) => {
  if(req.user.isBoss){
      next();
  } else {
      req.flash('error', "You are not the boss");
      res.redirect(redirectTo)
  }
}

const hasRole = (role) => {
  return (req, res, next) => {
      if (req.user.role.includes(role)){
          next();
      } else {
          req.flash('error', "You do not have a role!");
           res.redirect(redirectTo);
      }
  }
}

module.exports = {
  ensureLoggedIn,
  ensureLoggedOut,
  isBoss,
  hasRole
}