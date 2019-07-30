const express = require('express')
const coursesRoutes = express.Router()
const Course = require('../models/course.model')

/* GET home page */
coursesRoutes.get('/', (req, res, next) => {
	Course.find({})
		.then(allCourses => res.render('courses', { courses: allCourses }))
		.catch(err => console.log('ha habido un error: ', err))
})

module.exports = coursesRoutes
