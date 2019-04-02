const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");

// middleweres
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  } else {
    res.redirect('/login')
  }
};

function ensureBoss(req,res,next){
  let role = undefined;
  var validarol=function(){
    if(req.user == undefined) {return}
    else {return role = req.user.role}
  };
  validarol();
  if (role == 'BOSS'){return next()}
  else{ res.redirect('/')}  
};


// Termina Middlewares

//Para ver los usuarios existentes:
router.get("/",ensureAuthenticated,(req,res)=>{
  User.find()
.then(users =>{
res.render("profiles", {users});
})
.catch(err=>{
console.log(err);
})
});

//para ver el detalle de los perfiles:

router.get("/:id",ensureAuthenticated,(req,res)=>{
  const {id} = req.params;
  User.findById(id)
.then((user) =>{
  var rol = req.user.role;
  var func = function(){
  if(rol === 'BOSS'){return {boss: true , user }}
  else{return {boss: false , user }}
}; 
var data =func();
  console.log(data);
  return res.render("profile", data);

})
.catch(err=>{
console.log(err);
})
});

//para borrar usuarios (solo BOSS):

router.post("/:id",(req,res)=>{
  const {id} = req.params;
  console.log(id);
  User.findByIdAndDelete(id)
  .then(user =>{
      console.log(user)
      res.redirect('/profile')
    })
});



  module.exports = router;