const express = require('express');
const router  = express.Router();

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/auth/login");
}
function checkRole(role){
 return function(req,res,next){
   if(req.isAuthenticated() && req.user.role === role)
   return next();
   res.redirect("/private");
 }
}

const checkAdmin = checkRole("Boss");
const check = checkRole("Developer");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/private",isLoggedIn, (req,res)=>{
  res.render("Gprivate", {user: req.user});
})

router.get("/privateBoss", checkAdmin, (req,res)=>{
  res.render("private", {user: req.user});
})

module.exports = router;
