const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: String,
  role: { type: String, enum: ["Web", "UX/UI", "Data-Science"] },
  description: String,
  leadTeacher: String
}, {
  timestamps: true
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;