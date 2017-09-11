const checkRoles = (role) => {
  return (req,res,next) => {
      if (req.isAuthenticated() && req.user.role === role) {
        next();
      } else {
        console.log("No puedes Pasar!!");
        res.redirect('/login')
      }
  };
};

module.exports = checkRoles;
