const isAdmin = (redirectTo) => (req,res,next) => {
  if(req.user && (req.user.role === "Boss")){
      console.log("WELCOME TO THE ADMIN PAGE");
      next();
  }else{
      console.log("You are not an admin. You'll be redirected");
      res.redirect(redirectTo)
  }
}

module.exports = isAdmin;