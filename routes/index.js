const express = require('express');
const router  = express.Router();

function isLoggedIn(req,res,next){
  console.log(req.isAuthenticated());
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login")
}


/* GET home page */
router.get('/', isLoggedIn ,(req, res, next) => {
  res.render('index');
});

module.exports = router;
