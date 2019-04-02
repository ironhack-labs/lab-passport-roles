const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("pass/login", { login: true });
});
// ¿Para qué servirá esto?
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login"
    //,failureFlash: "Email o contraseña invalidos"
  }),
  (req, res) => {
  }
);
// para poner esta ruta segura:
router.get("/signup",ensureAuthenticated,ensureBoss,(req, res) => {
  res.render("pass/login");
});
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
}

// Termina Middlewares

router.post("/signup", (req, res) => {
  let { password, name, passwordConfirm,role } = req.body;

  if (password !== passwordConfirm)
    return res.render("pass/login", {
      err: "Las contras no son las mismas"
    });

  User.register({ name, role }, password).then(user => {
    res.redirect("/profile");
  });
});

router.get("/private",ensureAuthenticated, (req, res) => {
  var rol = req.user.role;
  const usrname = req.user.name;
  var func = function(){
  if(rol === 'BOSS'){return {boss: true ,ta:false, name: usrname }}
  if(rol === 'TA'){return {boss:false,ta: true , name: usrname }}
  else{return {boss: false ,ta:false, name: usrname }}
}; 
var user =func();
  console.log(user);
  return res.render("pass/private", user);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});



module.exports = router;
