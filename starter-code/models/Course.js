const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const courseSchema = new Schema({
  name : String,
  familyName : String,
  startingDate : Date,
  endDate : Date,
  level : { type : String, enum : ['Advanced', 'Beginner'], default : 'Advanced'},
  available : Boolean,
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
