const isAuthenticated = () => {
  return (req, res, next) => {
    if (req.user) {
      return next();
    } else {
      res.redirect("/login");
    }
  }
}

module.exports = isAuthenticated;