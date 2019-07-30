const express = require('express')
const rolesRoutes = express.Router()
const User = require('../models/user.model')
const Course = require('../models/course.model')

const checkLogged = () => (req, res, next) =>
	req.user ? next() : res.render('login', { message: `Necesitas estar logeado para realizar esa acción` })

const checkRoles = role => (req, res, next) =>
	req.user && req.user.role === role
		? next()
		: res.render('login', { message: `Necesitas ser un ${role} para realizar esa acción` })

rolesRoutes.get('/list', checkLogged(), (req, res, next) => {
	User.find({})
		.then(allUsers => res.render('user-list', { users: allUsers }))
		.catch(err => console.log('ha habido un error: ', err))
})

rolesRoutes.get('/signup', checkRoles('BOSS'), (req, res, next) => res.render('signup'))

rolesRoutes.post('/:id/delete', checkRoles('BOSS'), (req, res, next) => {
	const userId = req.params.id
	User.findByIdAndRemove(userId)
		.then(() => res.redirect('/list'))
		.catch(err => console.log('Ha habido un error: ', err))
})

rolesRoutes.get('/courses/create', checkRoles('TA'), (req, res, next) => res.render('create'))
rolesRoutes.post('/courses/create', checkRoles('TA'), (req, res, next) => {
	const { name, description, teacher } = req.body

	if (name === '' || description === '' || teacher == '') {
		res.render('create', { message: 'Rellene todos los campos' })
		return
	}

	Course.findOne({ name }).then(course => {
		if (course) {
			res.render('create', { message: 'Usuario ya existe' })
		}

		Course.create({ name, description, teacher })
			.then(() => res.redirect('/courses'))
			.catch(err => console.log('Ha habido un error: ', err))
	})
})

module.exports = rolesRoutes
