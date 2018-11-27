const express = require('express');
const router  = express.Router();
const User = require("../models/User")
const passport = require('passport')

/* GET home page */
router.get('/login', (req, res, next) => {
  res.render('auth/login');
  // res.send("hola")
  // User.register({username:"boss",role:"BOSS"},"admin")
  // .then(user=>{
  //   res.json(user)
  // })
  // .catch(e => next(e))
});

router.post('/login', passport.authenticate("local",{failureRedirect:"/auth/login"}), (req, res, next)=>{
  const username = req.user.username
  req.app.locals.user = req.user
  res.send('Tu eres un usuario real con username: ' + username)
})

module.exports = router;
