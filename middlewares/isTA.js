const isTA = (redirectTo) => (req,res,next) => {
  if(req.user && (req.user.role === "TA")){
      console.log("Hola TA");
      next();
  }  
  else{
      console.log("You are a looser, not a TA!");
      res.redirect(redirectTo)
  }
}

module.exports = isTA;