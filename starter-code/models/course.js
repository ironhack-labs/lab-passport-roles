const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema ({
  name: { type: String, require: true, unique: true },
  teacher: String,
  description: String,
  startDate: Date,
  endDate: Date,
  TA: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }]
}, {
  timestamps: true
})

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;