const isDeveloper = (redirectTo) => (req, res, next) => {
  if( req.user && req.user.role === "Developer") {
    next();
  } else {
    res.redirect(redirectTo);
  }
}

module.exports = isDeveloper;