const express = require('express');
const hasRole = require('../middleware/checkRoles');
const User = require('../models/User')
const router  = express.Router();
const ensureLogin = require('connect-ensure-login')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/profile', [
  hasRole('BOSS')
] , (req,res) => {
  res.render('private/profile');
})

/* GET all celebrities */
router.get('/celebrities', (req, res, next) => {
  Celebritie.find({}).then( celeb => {
    res.render('celebs/celebrities', {celeb});
  })
});


router.get('/user-list', ensureLogin.ensureLoggedIn(), (req, res) => {
  User.find({}).then( users => {
    res.render('userList', {users});
  })
});

module.exports = router;
