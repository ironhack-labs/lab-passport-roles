module.exports = function checkRoles(role) {
    return function(req, res, next) {
      console.log(role);
      console.log(req.user.role);
      if (req.user.role === role) {
        console.log("The User is a Boss");
        return next();
      } else {
        console.log("The User isn't a Boss");
        res.redirect('/login');
      }
    };
  };
  