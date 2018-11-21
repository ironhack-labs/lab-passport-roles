const roleCheck = (role, redirectTo='/') => (req,res,next) => {
  if(req.user.role == role) return next();
  req.flash('error',`You are not ${role}`);
  return res.redirect(redirectTo);
}

module.exports = {
  roleCheck
};
