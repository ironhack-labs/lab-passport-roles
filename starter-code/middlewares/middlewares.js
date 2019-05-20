const checkRole = (role) =>{
  return (req,res,next)=>{
   if (req.isAuthenticated() && req.user.role === role) {
     return next();
   } else {
     res.redirect('/login')
   }
  }
}


module.exports=checkRole
