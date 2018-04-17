const ensureLoggedIn = (redirectTo) => (req, res, next) => {
  if(req.user) {
    next();
  } else {
    res.redirect(redirectTo);
  }
}

module.exports = ensureLoggedIn;