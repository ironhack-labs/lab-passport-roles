const express = require('express')
const router = express.Router()
//const router = require("express").Router()
//es lo mismo
const passport = require('../config/passport')
const ensureLogin = require('connect-ensure-login')
//para obtener el perfil 
const checkRole = require('../middleware/checkRole')
const catchErrors = require('../middleware/catchErrors')
const { 
  logInForm, 
  createLogin, 
  getAccount, 
  makeAccount, 
  logOut,
  staffprofile
  } = require('../controllers/index')
const {createForm, createUser} = require('../controllers/bosscontrollers')
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})
//router.get('/signup', signUpForm)
//router.post('/signup', createUser)
router.get('/login', catchErrors(logInForm))
router.post('/login', passport.authenticate('local'), createLogin)
router.get('/account', checkRole('BOSS'), ensureLogin.ensureLoggedIn(), getAccount)



router.get('/create', ensureLogin.ensureLoggedIn(), createForm)
router.post('/create', ensureLogin.ensureLoggedIn(), createUser)

//staff
router.get('/staffAccount', staffprofile)

router.get('/logout', logOut)


module.exports = router
