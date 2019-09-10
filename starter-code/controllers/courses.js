const Course = require('../models/Course')

exports.getCourse = async (req, res) => {
	const courses = await Course.find().populate('creator')
	let user = null
	if(req.user) {
		user = req.user.role === 'BOSS'
	}
	res.render('courses/profiles', { courses, user: req.user })
}

exports.createCourse = async (req, res) => {
	const { name, author } = req.body
	const { _id } = req.user

	await Course.create({ name, author: _id })
	res.redirect('/courses')
}

exports.createCourseForm = (req, res) => {
	res.render('courses/create')
}



exports.deleteCourse = async (req, res) => {
	const { id } = req.params
	await Course.findByIdAndDelete(id)
	res.redirect('/courses')
}