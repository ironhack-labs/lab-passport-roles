function ensureAuthenticated(req, res, next) {
  return function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = ensureAuthenticated;
