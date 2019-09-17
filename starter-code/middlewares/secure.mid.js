
module.exports.checkLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};

module.exports.checkRole = role => (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === role) {
    next();
  } else {
    res.redirect('/auth/index-users');
  }
};

module.exports.initialRole = role => (req, res, next) => {
  if (req.user.role === "BOSS") {
    res.redirect("/auth/index-boss")
    return
  };
  if (req.user.role === "TA") {
    res.redirect("/auth/index-TA");
    return
  }
  else {
    res.redirect ("/auth/index-users")
  }
}