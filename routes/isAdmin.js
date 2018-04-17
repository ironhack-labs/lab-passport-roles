const isAdmin = (redirectTo) => (req,res,next) => {
  if(req.user && req.user.isAdmin){
      console.log("ADMIN PAGE");
      next();
  }else{
      console.log("You are not an admin");
      res.redirect(redirectTo)
  }
}

module.exports = isAdmin;