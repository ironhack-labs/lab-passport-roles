function checkRoles(roles) {
  return function (req, res, next) {
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
      return next();
    } else {
      if (req.isAuthenticated()) {
        res.redirect("/list");
      } else {
        res.redirect("/login");
      }
    }
  };
}

module.exports = checkRoles;