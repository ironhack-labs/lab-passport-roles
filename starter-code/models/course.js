const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const CourseSchema = mongoose.Schema({
  name: {type: String},
  startingDate: {type: Date},
  endDate: {type: Date},
  level: {type: String},
  available: {type: Boolean}
  },
  {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = {course: Course};
