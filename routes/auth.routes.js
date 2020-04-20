const express = require('express')
const router = express.Router()

const User = require('../models/User.model')

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const passport = require('passport')

// add routes here

//SIGNUP FORM

router.get('/signup', (req, res) => res.render('auth/signup'))

module.exports = router
