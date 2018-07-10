const isBoss = (req, res, next) => {
  if (req.user) {
    if (req.user.roles == "Boss") next();
    else {
      req.flash("error", "You are not the Boss");
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
};

module.exports = {
  isBoss
};
