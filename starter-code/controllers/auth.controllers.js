exports.getLogin = (req, res, next) => res.render('auth/login');

exports.postLogin = (req, res, next) => res.redirect('/');

exports.getLogout = (req, res, next) => {
  req.logout()
  res.redirect('/')
};
