const Course = require("../models/Course");

exports.getCreate = (req, res, next) => res.render("courses/create", { user: req.user });

exports.postCreate = async (req, res, next) => {
  const { name, desc } = req.body;
  console.log(name, desc)
  await Course.create({ name, desc });
	res.redirect("/courses/all");
};

exports.getAll = async (req, res, next) => {
	const courses = await Course.find({});
	res.render("courses/all", { user: req.user, courses });
};

exports.getCourse = async (req, res, next) => {
	const { id } = req.params;
	const course = await Course.findById(id);
	res.render("courses/course", { user: req.user, course });
};

exports.postCourse = async (req, res, next) => {
	const { id } = req.params;
	const { name, desc } = req.body;
	await Course.findByIdAndUpdate(id, { name, desc });
	res.redirect("/courses/all");
};

exports.getDelete = async (req, res, next) => {
	const { id } = req.params;
	await Course.deleteOne({_id: id});
	res.redirect("/courses/all");
};