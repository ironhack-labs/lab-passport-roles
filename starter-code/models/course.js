const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

var studentsSchema = new Schema({ name: 'string' });

const courseSchema = new Schema({
  coursename: String,
  alumnos: [studentsSchema]
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;