const express = require('express');
const router  = express.Router();

const User      = require('../models/User')
const passport  = require('passport')


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

 router.post("/",passport.authenticate("local") ,(req,res,next)=>{
  res.redirect(`/${req.user.role}`)
})

router.get("/list",(req,res,next)=>{
  User.find()
    .then(users=>{
      res.render("list",{users})
    })
    .catch(e=>next(e))
})

module.exports = router;