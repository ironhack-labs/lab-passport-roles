
const roleCheck = (role, redirectTo = "/") => (req, res, next) => {
  console.log(req.user);
  if (req.user) {
    if (req.user.role == role) return next();
    req.flash("error", "can not enter");
    return res.redirect(redirectTo);
  }
  res.redirect("/");
  console.log(req.user);
};

module.exports = {
  roleCheck
};
