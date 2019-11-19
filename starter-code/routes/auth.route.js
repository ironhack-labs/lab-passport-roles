const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require('../models/User.models')
// const passport = require("passport");
const bcrypt = require("bcrypt")
const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)
//const hassPass = bcrypt.hashSync(req.body.password, salt)

const passport = require("passport")
const ensureLogin = require("connect-ensure-login")
const checkBoss = role => (req, res, next) => req.user && req.user.role === role ? next() : res.redirect("/login/manageStaff")
const checkDev = role => (req, res, next) => req.user && req.user.role === role ? next() : res.redirect("/login/manageTa")
const checkTa = role => (req, res, next) => req.user && req.user.role === role ? next() : res.redirect("/")


router.get('/', (req, res) => res.render('auth/index'))
router.post('/', passport.authenticate('local', {
  successRedirect: "/login/manageBoss",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

router.get('/manageBoss', checkBoss('Boss'), (req, res) => {
  User.find()
    .then(allTheIronHackers => {
      res.render('auth/manageBoss', { users: allTheIronHackers })
      console.log(allTheIronHackers.username)
    })
    .catch(err => console.log("error al renderizar pagina de manageBoss", err))
})
router.post('/manageBoss', (req, res) => {
  const username = req.body.username
  const password = bcrypt.hashSync(req.body.password, salt)
  const role = req.body.role
  User.create({ username, password, role })
    .then(x => res.redirect('/login/manageBoss'))
    .catch(err => console.log("error al crear usuario", err))
})

router.get('/:id/delete', (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(x => res.redirect('/login/manageBoss'))
    .catch(err => console.log('error de mierda', err))
})

router.get('/manageStaff', checkDev('Developer'), (req, res) => {
  User.find()
    .then(allTheIronHackers => {
      res.render('auth/manageStaff', { users: allTheIronHackers, user: req.user })
        .catch(err => console.log("error al cargar BBDD", err))
    })
})


router.get('/manageTa', checkTa('TA'), (req, res) => {
  User.find()
    .then(allTheIronHackers => {
      res.render('auth/manageTA', { users: allTheIronHackers, user: req.user })
        .catch(err => console.log("error al cargar BBDD", err))
    })

})
router.post('/manageTa', (req, res) => {
  const username = req.body.username
  const password = bcrypt.hashSync(req.body.password, salt)
  const userId = req.body._id
  User.findByIdAndUpdate(userId, { username, password })
    .then(res.redirect('/login'))
    .catch(err => console.log('error', err))
})

module.exports = router;