module.exports.checkLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};

module.exports.checkRole = role => (req, res, next) => {
  console.log(req.user)
  if (req.isAuthenticated() && req.user.role === role) {
    next()
  } res.redirect('/signup')
};
