const express = require('express');
const router  = express.Router();
const User = require('../models/User');


//middleware
function checkIfAdmin(req,res,next){
  if(req.user.role === "BOSS") return next();
  res.send('Tu no tienes permiso!')
}

//checkRole('role') -- this is a kind of callback that can receive an arg
function checkRole(roleToCheck){
  return (req,res,next)=>{      //bc the router has to receive a middleware
    if (!req.isAuthenticated()) return res.redirect('/login');
    if (req.user.role === roleToCheck) return next();
    return res.send('You are not authorized :(')
  }
}

//admin panel
router.get('/boss', checkRole('BOSS'), (req,res,next)=>{
  User.find({})
  .then(users=>{
    res.render('boss', {users});
  })
  .catch(err=>next())
})

//add courses
router.get('/newCourse', checkRole('TA'), (req,res,next)=>{
  res.render('auth/newCourse')
})

//DELETE courses and users

router.post('/:id/deleteuser', checkRole('BOSS'), (req,res,next) => {
  User.findByIdAndRemove(req.params.id)
  .then(results=>{
      res.render('auth/private')
      })
  .catch(err=> next())

})

router.post('/:id/deletecourse', checkRole('TA'), (req,res,next) => {
  Course.findByIdAndRemove(req.params.id)
  .then(results=>{
      res.render('auth/private')
      })
  .catch(err=> next())

})

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;