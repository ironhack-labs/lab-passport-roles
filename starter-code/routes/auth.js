const router = require('express').Router()
const passport = require('../config/passport')
const {mostrarLogin, formLogin, proceedLogin, proceedLogout, mostrarAddUser, formAddUser, mostrarUpdateProfile, formUpdateProfile} = require('../controllers/index')
const checkRoles = require('../middlewares/checkRoles')
const catchErrors = require('../middlewares/catchErrors') //where should I?

//Autenticación
router.get('/addUser', mostrarAddUser)
router.post('/addUser', formAddUser)
router.get('/login', mostrarLogin)
router.post('/login', passport.authenticate('local'), formLogin)
router.get('/profile/', isLoggedIn, proceedLogin)
router.get('/logout', proceedLogout)
router.get('/updateProfile', mostrarUpdateProfile)
router.post('/updateProfile', formUpdateProfile)

//función checadora
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

module.exports = router