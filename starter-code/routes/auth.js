const router = require('express').Router()
const User = require('../models/User')
const { newUserform, newUser, loginForm, loginUser, getProfile } = require('../controllers/user')
// Passport
const passport = require('../config/passport')
const ensureLogin = require('connect-ensure-login')

/*******************************/
/*********** SIGN UP ***********/
/*******************************/
router.get('/signup', newUserform)
router.post('/signup', newUser)

router.get('/login', loginForm)
router.post('/login', loginUser)

router.get('/profile', getProfile)

module.exports = router
