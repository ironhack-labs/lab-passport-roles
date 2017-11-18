module.exports=function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    }else{
      console.log("Denegate, rol permission");
      res.render('auth/auth-main', {errorMessage:"Denegate, rol permission"});
    }
  };
};
