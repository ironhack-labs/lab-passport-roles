const express   = require("express");
const router    = express.Router();
const User      = require("../models/User")
const passport  = require("passport");

const checkRole = (req,res,next)=>{
  User.findOne({username: req.body.username})
  .then(user=>{
    console.log(user)
    if(user.role === "BOSS") {
      return next();
    }
     res.send("no tienes acceso");
  })
  .catch(e=> console.log(e));
};


router.post("/signup", (req,res,next)=>{
  if(req.body.pass1 !== req.body.pass2){
    req.body.error = "Tus contraseñas no coinciden";
    return res.render("./auth/signup", req.body);
  }
  User.register(req.body, req.body.pass1, function(err, user) {
      if (err) return next();
      res.redirect("/login");
  });
});


router.get("/signup", (req,res)=>{
  res.render("./auth/signup");
});

router.get("/login", (req,res)=>{
  res.render("./auth/login");
});

router.post("/login", checkRole , (req, res, next)=>{
  res.redirect("/signup");
})



module.exports  = router;