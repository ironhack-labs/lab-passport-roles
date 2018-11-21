const roleCheck = (role, redirectTo='/') => (req,res,next) => {
    if(req.user){
    if(req.user.role == role) return next();
    //req.flash('error','Unauthorized');
    return res.redirect(redirectTo)}
    res.redirect("/")
  }
  
  module.exports = {
    roleCheck
  }