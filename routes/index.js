const express = require('express');
const router  = express.Router();

function checkIfBoss(req,res,next){
  if(req.user.role === "BOSS") return next();
  res.send('Tu no tienes permiso!');
}
router.get('/boss', checkIfBoss, (req, res, next) => {
  res.render('tetengo un monton de chismes!!');
});

function checkIfAT(req,res,next){
  if(req.user.role === "AT") return next();
  res.send('Tu no tienes permiso!');
}
router.get('/at', checkIfAT, (req, res, next) => {
  res.render('tetengo un monton de chismes!!');
});

function checkIfDeveloper(req,res,next){
  if(req.user.role === "DEVELOPER") return next();
  res.send('Tu no tienes permiso!');
}
router.get('/developer', checkIfDeveloper, (req, res, next) => {
  res.render('tetengo un monton de chismes!!');
});

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
