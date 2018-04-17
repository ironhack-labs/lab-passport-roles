const isBoss = (redirectTo) => (req, res, next) => {
  if( req.user && req.user.role === "Boss") {
    next();
  } else {
    res.redirect(redirectTo);
  }
}

module.exports = isBoss;