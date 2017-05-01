/*jshint esversion: 6*/
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const courseSchema = Schema({
  name: String,
  startingDate: Date,
  endDate: Date,
  level: String,
  available: Boolean
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
