const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const courseSchema = new Schema({
  name: String,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Courses = mongoose.model("Courses", courseSchema);

module.exports = Courses;