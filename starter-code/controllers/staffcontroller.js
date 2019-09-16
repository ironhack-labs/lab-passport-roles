const User = require('../models/User')
const Course = require('../models/Course')

exports.editStaffForm = (req, res, next) => {
  res.render('auth/editStaff', )
}

exports.editStaff = async (req, res, next) => {
  const {
    name,
    lastName
  } = req.body
  await User.findByIdAndUpdate(req.user._id, {
    name,
    lastName
  })
  res.redirect('/staffProfile')
}

exports.createCourseForm = async (req, res, next) => {
  const course = await Course.find()
  res.render('auth/createCourse', {
    course
  })
}

exports.createCourse = async (req, res, next) => {
  const {
    name,
    teacher,
    duration,
    classroom
  } = req.body
  await Course.create({
    name,
    teacher,
    duration,
    classroom
  })
  res.redirect('staffProfile')
}

exports.editCourseForm = async (req, res, next) => {

  res.render('auth/editCourse')
}

//const {id} = req.params
//const course = await Course.findById(id)

exports.editCourse = async (req, res, next) => {
  const {
    name,
    teacher,
    duration,
    classroom
  } = req.body
  await Course.findByIdAndUpdate({
    name,
    teacher,
    duration,
    classroom
  })
  res.redirect('/staffProfile')
}

exports.deleteCourse = async (req, res) => {
  const {
    id
  } = req.params
  await Course.findByIdAndDelete(id)
  res.redirect('/staffProfile')

}