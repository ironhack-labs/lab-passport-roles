const ensureLoggedOut = redirectTo => {
  return (req, res, next) => {
    if (!req.user) {
      console.log(`ACCESS GRANTED, no user.`);
      next();
    } else {
      console.log(`ACCESS DENIED. User is logged in, redirect!`);
      res.redirect(redirectTo);
    }
  };
};

module.exports = ensureLoggedOut;
