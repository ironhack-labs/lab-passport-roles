const ensureAuthenticated = (redirectURL, userID) => {
  return (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      } else {
        res.redirect('/')
      }
    }
};


module.exports = ensureAuthenticated;
