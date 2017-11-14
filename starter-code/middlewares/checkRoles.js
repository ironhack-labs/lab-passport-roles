
module.exports = function checkRoles(role) {
  return function(req, res, next) {
    if (req.user.role === role) {
      console.log("ES UN BOSS");
      return next();
    } else {
      console.log("NO ES BOSS");
      res.redirect('/login');
    }
  };
};
