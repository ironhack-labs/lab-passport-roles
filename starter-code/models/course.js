const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const courseSchema = new Schema({
  username: String,
  name: String,
  password: String,
  familyName: String,
  role :String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
