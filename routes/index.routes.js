const express = require('express');
const router = express.Router();
const ensureLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')
const User = require('../models/User.model')



/* GET home page */
router.get('/', (req, res) => res.render('index'));
router.get('/profile', ensureLoggedIn, (req, res) => res.render('auth/private', req.user))

router.get('/user', ensureLoggedIn, (req, res) => {
    User.find()
        .then(data => res.render('user', { data }))
        .catch(err => console.log(err) )
})

router.get('/show/:id', ensureLoggedIn, (req, res) => {
    User.findById(req.params.id)
    .then(data => res.render('show', data))
})






module.exports = router;