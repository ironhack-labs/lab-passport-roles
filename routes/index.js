const express = require('express');
const router  = express.Router();

//FUNCION PARA VERIFICAR SI ESTAS LOGEADO O NO
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/login");
}

function checkRole(role){
  return function(req,res,next){
    if(req.isAuthenticated() && req.user.role ===role) return next(); //Que esta autenticado y ademas es admin
    res.redirect("/private")
  }
}
const checkBoss = checkRole("BOSS") //Se pasa un role en particular

router.get("/private", isLoggedIn, (req, res) => {
  res.render("privateGeneral", {
    user: req.user
  });
});

router.get("/boss", checkBoss, (req,res)=>{
  res.render("bossPrivate", {user: req.user});
})

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
