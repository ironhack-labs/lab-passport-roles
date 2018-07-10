const express = require('express');
const { ensureLoggedIn, hasRole } = require('../middleware/mid');
const router = express.Router();
const User = require('../models/User');

 router.get('/base', (req, res, next) => {  
  User.find({})
  .then ( users => {
    console.log(users);
    res.render('private-base', {users});
  })
  .catch( ()=> console.log('Error in the users list'))
});

router.get('/base2', (req, res, next) => {  
  res.render('private-base2');
});





module.exports = router;