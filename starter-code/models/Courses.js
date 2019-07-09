const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const coursesSchema = new Schema({
  title: String,
}, {
  timestamps: true
});

const Courses = mongoose.model("Courses", coursesSchema);
module.exports = Courses;