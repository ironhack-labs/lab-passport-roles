
const express = require('express');
const router = express.Router();
const User = require('../models/User')
const passport = require('passport')


/* GET home page */
router.get('/', (req, res, next) => {
  User.register({username:"JEFECITO", role:"BOSS"},"password")
  .then(user =>{
    res.render('/')
  }).catch(err=>{res.redirect('/login')})
});


module.exports = router;