const express = require('express')
const passport = require('passport')
const ensureLogin = require('connect-ensure-login')

const authRoutes = express.Router()

const User = require('../models/user.model')

const bcrypt = require('bcrypt')
const bcryptSalt = 10

// authRoutes.get('/signup', (req, res, next) => res.render('signup'))
authRoutes.post('/signup', (req, res, next) => {
	const { username, role, password } = req.body

	if (username === '' || password === '' || role == '') {
		res.render('signup', { message: 'Fill all the fields' })
		return
	}

	User.findOne({ username }).then(user => {
		if (user) {
			res.render('signup', { message: 'User already exist' })
		}

		const salt = bcrypt.genSaltSync(bcryptSalt)
		const hashPass = bcrypt.hashSync(password, salt)

		User.create({ username, role, password: hashPass })
			.then(() => res.redirect('/'))
			.catch(err => console.log('An error ocurred: ', err))
	})
})

authRoutes.get('/login', (req, res, next) => {
	res.render('login', { message: req.flash('error') })
})

authRoutes.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true,
		passReqToCallback: true
	})
)

authRoutes.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/login')
})

module.exports = authRoutes
