const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const CourseSchema = new Schema({
  name: String,
  startingDate: Date,
  endDate: Date,
  level: String,
  available: Boolean,
  students: Array
});

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
