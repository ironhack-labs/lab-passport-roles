const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const courseSchema = new Schema({
  author: String,
  title: String,
  description: String
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;