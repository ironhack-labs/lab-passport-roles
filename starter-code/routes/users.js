const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);



//ensure login
const ensureLogin = require("connect-ensure-login");

//passport
const passport = require("passport");

// rutas de empleados

router.get("/",(req,res,next)=>{
  User.find({}, (err,docs)=>{
      if(err){
          next();
          return;
      }else{
         // console.log("8===========D")
          console.log(docs);
          res.render("employees/manage", {users:docs});
      }
    });
});

// 
router.get("/new",checkRoles('Boss'), (req, res, next) => {
  res.render("employees/new_user");
});

router.post("/new",(req,res,next)=>{
    const newUser=new User({
        name:req.body.name,
        username:req.body.username,
        familyName:req.body.familyName,
        role:req.body.role
    });
    newUser.save((err,celeb)=>{
        if (err){
          res.redirect("users/new");
        }else{
          res.redirect("users");
        }
        
    });

})



router.get("/:id/edit",checkRoles('Boss'), (req,res,next)=>{
  const id=req.params.id;
  console.log(id);
  User.findById(id,(err,doc)=>{
      if (err){
          next();
          return err;
      }else{
          res.render("employees/edit",{user:doc});
      }
  });
});



router.post('/:id', (req, res, next) => {
  const productId = req.params.id;

  const updatedUser={
      name:req.body.name,
      username:req.username,
      familyName:req.body.familyName,
      password:req.body.password,
      role:req.body.role
  };
  User.findByIdAndUpdate(productId, updatedUser, (err, u) => {
    if (err){ return next(err); }
    return res.redirect('/users');
  });
});



router.post("/:id/delete", checkRoles('Boss'),(req,res,next)=>{
  const id=req.params.id;
  User.findByIdAndRemove(id,(err,doc)=>{
      if (err){
          next();
          return err;
      }else{
          res.redirect("/users");
      }
  })
});




//middleware for ensure role
function checkRoles(role){
  return function(req, res,next){
      if(req.isAuthenticated() && req.user.role === role){
          return next();
      }else{
          res.redirect("/login");
      }
  }
}



module.exports = router;