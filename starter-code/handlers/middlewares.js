exports.isLogged = (req, res, next) =>
  !req.isAuthenticated() ? res.redirect('admin') : next()

exports.checkRole = role => (req, res, next) =>
  role !== req.user.role ? res.send('Unauthorized') : next()
