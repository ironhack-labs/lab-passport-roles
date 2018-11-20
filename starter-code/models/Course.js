const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema ({
  title: String, 
  duration: String
}, 
{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;