module.exports = (role), (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === role) {
    return next();
  } else {
    res.redirect('/login');
  }
};
