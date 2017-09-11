const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const CourseSchema = mongoose.Schema({
  name: String,
  startingDate: Date,
  endDate: Date,
  level: String,
  available: Boolean
  },
  {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = {course: Course};
