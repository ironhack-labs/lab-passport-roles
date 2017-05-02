const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const courseSchema = new Schema({
  name: String,
  startingDate: Date,
  endDate: Date,
  available: Boolean,
  level: {
    type: String,
    enum : ['Beginner','Advanced', 'Pro'],
    default : 'Beginner'
  }
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
