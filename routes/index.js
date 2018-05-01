const express = require('express');
const router  = express.Router();

const checkIfBoss = (req,res)=>{
  if(req.user.role === 'BOSS'){ 
  return next();
}else{
  res.send('No tienes acceso');
}
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
