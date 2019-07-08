const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CourseSchema = mongoose.Schema({

  namecourse: String,
  professor: String,
  duration: Number
  
});

const Course = mongoose.model('Course',CourseSchema);

module.exports = Course;