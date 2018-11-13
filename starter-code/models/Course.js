const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: String,
  description: String,
  type: {
    type: String,
    enum: ['Bootcamp', 'Part-time'],
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'upadted_at'
  }
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
