const express = require('express');
const router  = express.Router();
const User = require('../models/User')

function checkRole(role){
  return (req,res,next)=>{
    if(!req.isAuthenticated()) return res.redirect('/login');
    if(role === req.user.role) return next();
    return res.send('NO tienes permiso');
  }
}
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/boss', checkRole('BOSS'),(req,res, next)=>{
  User.find()
  .then(user=>res.render('boss', {user}))
  .catch(err=>res.send(err))
})

module.exports = router;
