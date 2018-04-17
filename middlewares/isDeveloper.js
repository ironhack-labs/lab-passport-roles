const isdeveloper = (redirectTo) => (req,res,next) => {
  if(req.user && (req.user.role === "developer")){
      console.log("Hola developer");
      next();
  }  
  else{
      console.log("You are a looser, not a developer!");
      res.redirect(redirectTo)
  }
}

module.exports = isdeveloper;