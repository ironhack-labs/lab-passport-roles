const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: String,
  startingDate: String,
  endDate: String,
  level: String,
  available: Boolean
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
