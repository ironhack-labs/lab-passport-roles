const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  const course = await Course.create({ ...req.body });
  console.log(course);
  res.redirect('/course');
};

exports.getCourses = async(req, res) => {
  const courses = await Course.find();
  console.log(courses);
  res.render('../views/course/index', {courses: courses});
};

exports.getCourse = async(req, res) => {
  const [course] = await Course.find({_id: req.params.id});
  res.render('../views/course/get', {course: course});
};

exports.editCourse = async(req, res) => {
  const [course] = await Course.find({_id: req.params.id});
  res.render('../views/course/edit', {course: course});
};

exports.updateCourse = async(req, res) => {
  const user = await Course.findByIdAndUpdate(req.params.id, req.body);
  console.log(user);
  res.redirect(`/course/${req.params.id}`);
};

exports.deleteCourse = async (req, res) => {
    await Course.findByIdAndDelete(req.params.id);
  res.redirect('/course');
};

