const express = require("express");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login") // Asegurar la sesión para acceso a rutas
const Handlebars = require('handlebars')
const Swag = require('swag')
const router = express.Router();
Swag.registerHelpers(Handlebars)
const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10


router.get('/', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find()
  .then(users => {
    users.map(user => {
      if (user._id.equals(req.user._id)) {
        user.canEdit = req.user._id
      }
      if (req.user.role === 'BOSS') {
        user.canDelete = true
        user.canCreate = true
        user.canEdit = true
      }
    });
    res.render('user', {users, user: req.user})
  })
  .catch(err => console.log(err))
});

router.get('/delete/:id', (req, res, next) =>{
  const userId = req.params.id
  //console.log("mycelebid ",celebId)

  User.findOneAndDelete({_id: userId})
     .then(() => res.redirect('/user'))
})

router.get('/edit', ensureLogin.ensureLoggedIn(),(req, res, next) => {
  User.findById(req.query.userId)
    .then(user => {
            console.log(user.username, user.password, user.role)
            if(req.user.role === "BOSS"){
              user.canEdit = true
            }
    res.render('user-edit', {user})
  })
  .catch(err => console.log(err))
});

router.post('/edit', (req, res, next) => {

  const {username, password: hashPass, role} = req.body

  User.findByIdAndUpdate(req.query.userId, {$set: {username, password, role}}, {new: true})
    .then(() => res.redirect('/'))
    .catch(err => console.log('Hubo un error:', err))
})

router.get('/:id', (req, res, next) => {
  const userId = req.params.id
  User.findById(userId)
  .then(user => res.render('user-detail', {user}))
  .catch(err => console.log('Hubo un error: ', err))
})


module.exports = router