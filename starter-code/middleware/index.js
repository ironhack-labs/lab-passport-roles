exports.catchErrors = fn => {
  return (req, res, next) => {
    return fn(req, res, next).catch(next);
  };
};

exports.checkRoles = role => {
  if (typeof role === "string")
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === role) return next();
      res.redirect("/profile");
    };

  return (req, res, next) => {
    if (!req.isAuthenticated()) res.redirect("/login");
    const isAuthorize = role.reduce((accum, currentValue) => {
      return accum || currentValue === req.user.role;
    }, false);

    if (isAuthorize) return next();
    res.redirect("/login");
  };
};

exports.isLoggedIn = (req, res, next) =>
  req.isAuthenticated() ? next() : res.redirect("/login");
