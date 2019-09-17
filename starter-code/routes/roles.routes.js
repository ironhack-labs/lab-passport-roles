const express = require('express')
const rolesRoutes = express.Router()
const User = require('../models/user.model')
const Course = require('../models/course.model')

const checkLogged = () => (req, res, next) =>
	req.user ? next() : res.render('login', { message: `You need to be logged` })

const checkRoles = role => (req, res, next) =>
	req.user && req.user.role === role
		? next()
		: res.render('login', { message: `You need to be a BOSS for create accounts and TA for create courses.` })

rolesRoutes.get('/list', checkLogged(), (req, res, next) => {
	User.find({})
		.then(allUsers => res.render('user-list', { users: allUsers }))
		.catch(err => console.log('An error ocurred: ', err))
})

rolesRoutes.get('/signup', checkRoles('BOSS'), (req, res, next) => res.render('signup'))

rolesRoutes.post('/:id/delete', checkRoles('BOSS'), (req, res, next) => {
	const userId = req.params.id
	User.findByIdAndRemove(userId)
		.then(() => res.redirect('/list'))
		.catch(err => console.log('An error ocurred: ', err))
})

rolesRoutes.get('/courses/create', checkRoles('TA'), (req, res, next) => res.render('create'))
rolesRoutes.post('/courses/create', checkRoles('TA'), (req, res, next) => {
	const { name, description, teacher } = req.body

	if (name === '' || description === '' || teacher == '') {
		res.render('create', { message: 'Fill all the fields' })
		return
	}

	Course.findOne({ name }).then(course => {
		if (course) {
			res.render('create', { message: 'User already exist' })
		}

		Course.create({ name, description, teacher })
			.then(() => res.redirect('/courses'))
			.catch(err => console.log('An error ocurred: ', err))
	})
})

module.exports = rolesRoutes
