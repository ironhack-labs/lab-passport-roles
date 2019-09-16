
module.exports.checkLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports.checkRole = role => (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === role) {
    next();
  } else {
    res.redirect('/');
  }
};
