const express = require('express');
const router  = express.Router();
const User = require('../models/User');

function isAuthenticated(req,res,next){
  if(req.isAuthenticated()){
      return next()
  }else{
      res.redirect('/login');
  }
}

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/:id/profile', isAuthenticated, (req,res)=>{
  res.render('profile');
})

router.post('/:id/profile', isAuthenticated, (req,res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(newUser=>{
      req.app.locals.usuario = newUser;
      res.redirect('/'+newUser._id+'/profile');
    })
    .catch(e=>{
      res.send(e);
    });
});

router.get('/profiles', isAuthenticated, (req,res, next)=>{
  User.find({})
    .then(result=>{
      console.log(result);
      res.render('profile-list', {result});
    })
    .catch(e=>next(e));
});

module.exports = router;
