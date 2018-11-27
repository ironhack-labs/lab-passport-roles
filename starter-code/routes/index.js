const express = require('express');
const router  = express.Router();
const User = require('../models/User')
const passport = require('passport')



/* GET home page */
router.get('/', (req, res, next) => {
  User.register({username:'Jefe', role:'BOSS'}, 'admin')
  .then(user=>{
    res.send(user)
  })
  .catch(e=>{
    next(e)
  })
});

module.exports = router;
