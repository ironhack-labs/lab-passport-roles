const router = require('express').Router()
const User = require('../models/User')
const passport = require('../config/passport')
//const ensureLogin = require('connect-ensure-login')

router.get('/adduser', (req,res,next) => {
	const config = {
		title: 'Add User',
		action: '/adduser',
		button: 'Add User',
		register: true
	}
	res.render('auth/form', config)
})

router.get('/login', (req,res, next) => {
	const config = {
		title: 'Log in',
		action: '/login',
		button: 'Log in'
	}
	res.render('auth/form', config)
})

router.post('/adduser', async (req,res, next) => {
	try {
		const user = await User.register({ ...req.body }, req.body.password) //thnks to PLM
		console.log(user)
		res.redirect('/login')
	} catch (err) {
		console.log(err)
		res.send('El usuario ya existe')
	}
})

router.post('/login', passport.authenticate('local'), (req,res, next) => {
	res.redirect('/profile')
})

router.get('/profile', (req, res, next) => {
	console.log(req.user)
  res.render('auth/profile', {user: req.user});
})

router.get('/logout', (req, res, next) => {
	req.logOut()
	res.redirect('/login')
})

function isLoggedIn (req, res, next) {
	if(req.isAuthenticated()) {
		next()
	} else {
		res.redirect('/login')
	}
}

module.exports = router;