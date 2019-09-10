const Course = require("./../models/Course");
const User = require("./../models/User");

exports.getAllCourses = async (req, res) => {
  let courses;
  if (req.user.role === "STUDENT") {
    courses = await Course.find({ alumni: req.user._id });
  } else {
    courses = await Course.find();
  }
  res.render("courses/index", { courses });
};

exports.getCourse = async (req, res) => {
  const course = await Course.findById(req.params.id).populate("alumni");
  console.log(course);
  const isTA = req.user.role === "TA";
  res.render("courses/details", { course, isTA });
};

exports.createCourseForm = async (req, res) => {
  const alumni = await User.find({ role: "STUDENT" });
  const options = {
    title: "Create course",
    action: "add",
    alumni
  };
  res.render("courses/form", options);
};

exports.createCourse = async (req, res) => {
  console.log(req.body);
  const { title, body, alumni } = req.body;
  await Course.create({ title, body, alumni });
  res.redirect("/courses");
};

exports.editCourseForm = async (req, res) => {
  const course = await Course.findById(req.params.id);
  const alumni = await User.find({ role: "STUDENT" });
  const options = {
    title: "Edit course",
    action: "/edit",
    course,
    alumni
  };
  res.render("courses/form", options);
};

exports.editCourse = async (req, res) => {
  const { title, body, alumni } = req.body;
  console.log(req.body);
  await Course.findByIdAndUpdate(req.params.id, { title, body, alumni });
  res.redirect("/courses");
};
