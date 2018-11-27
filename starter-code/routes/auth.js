const express = require('express');
const router  = express.Router();
const passport = require("passport");
const User = require("../models/User");



router.post('/login', passport.authenticate("local"), (req,res,next)=>{
    res.send('entraste')
})


router.get('/login', (req, res, next) => {
  // User.register({username:"JEFECITO", role:"BOSS"}, 'admin')
  // .then(user=>{
  //   res.send(user)
  // }).catch(err=>{
  //   console.log(err)
  // })
  res.render('auth/login')

});

//res.render('/auth/login')

module.exports = router;
