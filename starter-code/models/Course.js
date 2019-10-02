const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const courseSchema = new Schema({
  title: String,
  category: String,
  description: String,
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;