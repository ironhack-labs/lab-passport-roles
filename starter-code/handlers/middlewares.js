exports.isLogged = (req, res, next) =>
  !req.isAuthenticated() ? res.redirect('/login') : next()

exports.checkRole = role => (req, res, next) =>
  role !== req.user.role ? res.send('Unauthorized') : next()