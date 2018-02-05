const isBoss = (req, res, next) => {
  if (req.User.role === 'Boss') {
    next();
  } else {
    console.log("[Forbidden] User cannot access this page");
    res.redirect("/");
  }
};

module.exports = isBoss;
