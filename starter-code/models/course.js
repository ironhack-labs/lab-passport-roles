const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: {type: String, required: true},
  discipline: String,
  duration: {type: String,required: true, default: "9 weeks"}
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course