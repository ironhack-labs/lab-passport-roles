const express = require('express');
const router  = express.Router();
const passport = require("passport");
const User = require('../models/User')

/* GET home page */
router.get('/', (req, res, next) => {
  User.register({username:"jefecito", role:"BOSS"},"password")
  .then(user =>{
    res.send(user)
  }).catch(err=>{res.redirect('/')})
});

module.exports = router;
