const express = require('express');
const User = require('../models/User')
const router  = express.Router();
const ensureLogin = require('connect-ensure-login')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



router.get('/user-list', ensureLogin.ensureLoggedIn('/auth/login'), (req, res) => {
  User.find({}).then( users => {
    if(req.user.role.includes('BOSS')){
      users.forEach(e => e.isBoss = true);
      res.render('userList', {users});
    } else res.render('userList', {users});
  })
});

/* GET edit User page*/
router.get('/:id/edit', (req,res) => {
  User.findById(req.params.id).then(user => {
    res.render('edit',{user});
  })
})

/* POST to update a User in DB */
router.post('/:id/edit', (req,res) => {
  const { username, password} = req.body;
  User.findByIdAndUpdate(req.params.id,{ username, password})
      .then( user => {
        console.log(`User ${user.name} succesfully updated`)
        res.redirect('/user-list')
      })
})

module.exports = router;
