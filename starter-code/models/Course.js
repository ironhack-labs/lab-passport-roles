const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = mongoose.Schema({
  name: String,
  startingDate: Date,
  endDate: Date,
  level: String,
  available: Boolean
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;