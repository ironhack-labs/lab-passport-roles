const isTA = (redirectTo) => (req, res, next) => {
  if( req.user && req.user.role === "TA") {
    next();
  } else {
    res.redirect(redirectTo);
  }
}

module.exports = isTA;