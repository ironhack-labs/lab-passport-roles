const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const courseSchema = new Schema({
  course: {type: String, required: true},
  description: String,
}, {
  timestamps: true
});

const Course = mongoose.model("Course", userSchema);

module.exports = Course;