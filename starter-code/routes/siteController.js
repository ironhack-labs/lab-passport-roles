const express = require("express");
const router = express.Router();
const passport= require("passport");
const User = require('../models/user')
var checkBoss  = checkRoles('Boss');


function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === Boss) {
      return next();
    } else {
      res.redirect('../views/private/indexBoss');
    }
  };
}


router.get("/", (req, res, next) => {
  console.log("ENTRO EN INDEX");
  res.render("index");
});


router.post("/private", checkBoss,(req,res,next)=>{
  res.render("private/indexBoss" , {user: req.user});
});



module.exports = router;
