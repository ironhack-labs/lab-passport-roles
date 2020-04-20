const express = require('express');
const router = express.Router();
const User = require("../models/User.model")

const ensureLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

const checkRole = roledata => (req, res, next) => req.isAuthenticated() && req.user.role.includes(roledata) ? next() : res.render('auth/login', { errorMsg: 'Area restringida' })
router.get('/', ensureLoggedIn, (req, res) => {

        User.find()
                .then((allUsers) => res.render('users/index', { allUsers }))
                .catch((error) => console.log('Error while getting the books from the DB: ', error))
})



module.exports = router;