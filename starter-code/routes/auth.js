const express = require('express')
const routerA = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

routerA.get('/login', (req, res, next) => {
    res.render('auth/login')
})

routerA.post('/login', passport.authenticate('local', {
    successRedirect: '/main',
    failureRedirect: '/auth/login'
}))

module.exports = routerA