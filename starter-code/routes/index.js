const express = require('express')
const router = express.Router()
const {createUser, getSignup, getLogin, createLogin, getAccount} = require('../controllers/index')
const passport = require('../config/passport')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/signup', getSignup)
router.post('/signup', createUser)
router.get('/login', getLogin)
router.post('/login', passport.authenticate('local'), createLogin)
router.get('/account', isLoggedIn, getAccount)


//router.get('/cursos', getCourse)

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect("/login")
  }
}

module.exports = router
