const isAdmin = (role) => (req,res,next) => {
  if(req.user && req.user.role === role){
      console.log("WELCOME MY LORD ADMIN");
      return next();
  }else{
      console.log("You are a looser, not an admin!");
      res.redirect("/")
  }
}

module.exports = isAdmin;