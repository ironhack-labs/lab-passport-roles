const isBoss = (redirectTo) => (req,res,next) => {
  if(req.user && req.user.role == "Boss"){
      console.log("Welcome Boss");
      next();
  }else{
      console.log("You are not an admin!");
      res.redirect(redirectTo)
  }
}

module.exports = isBoss;