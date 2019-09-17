const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    unique: true,
  }
}, {
  timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;