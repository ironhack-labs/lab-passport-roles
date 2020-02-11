const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  course: String,
  season: String,
  campus: String,
  start: String,
  end: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Course = mongoose.model("Course", userSchema);

module.exports = Course;