const isAdmin = (redirectTo) => (req,res,next) => {
  if(req.user && (req.user.role === "boss")){
      console.log("WELCOME MY LORD ADMIN");
      next();
  }  
  else{
      console.log("You are a looser, not an admin!");
      res.redirect(redirectTo)
  }
}

module.exports = isAdmin;