
module.exports = function checkRoles(role) {
  return function(req, res, next) {
    console.log("Comprobando");
    console.log(role);
    console.log(req.user.role);
    if (req.user.role === role) {
      console.log("ES UN BOSS");
      return next();
    } else {
      console.log("NO ES BOSS");
      res.redirect('/login');
    }
  };
};
