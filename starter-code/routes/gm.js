const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')

const isBoss = (req, res, next)=>{
	if (!req.user) return res.redirect('/')
	if (req.user.role === 'BOSS') return next()
	req.logOut()
	return res.redirect('/')
}

router.get('/delete/:id', isBoss, (req, res, next)=>{
	const {id} = req.params
	User.findByIdAndDelete(id)
			.then(()=>{
				res.redirect('/gm')
			})
			.catch(e => {
				req.app.locals.error = e
			})
})

router.post('/edit/:id', isBoss, (req, res, next)=>{
	const {id} = req.params
	User.findByIdAndAUpdate(id, {...req.body}, {new:true})
			.then(()=>{
				res.redirect('/gm')
			})
			.catch(e => {
				req.app.locals.error = e
			})
})

router.get('/edit/:_id', isBoss, (req, res ,next)=>{
	const {_id} = req.params
	User.findById(_id)
			.then(user=>{
	let config = {
		title: 'Edit member',
		action: `/gm/edit/${id}`,
		submit: 'Save Changes',
		name: user.name,
		email: user.email,
		password: true,
	}

	res.render('gm/signup', config)
			})
			.catch(e => {
				req.app.locals.error = e
			})
})

router.get('/signup', isBoss, (req, res, next)=>{
	let config = {
		title: 'Add new member',
		action: '/gm/signup',
		submit: 'Create New',
		name: '',
		email: '',
		password: false,
	}
	res.render('gm/signup')
})

router.get('/', isBoss, (req, res, next)=>{
	User.find()
			.then(users => {
				res.render('gm/gm', {users})
			})
			.catch(e => {
				req.app.locals.error = e
			})
	res.render('gm/gm')
})

router.post('/signup', isBoss, (req, res, next)=>{
	User.register({...req.body}, req.body.password)
			.then(user => {
				res.redirect('/gm')
			})
			.catch(e => {
				req.app.locals.error = e
				res.redirect('/gm')
			})
})





module.exports = router