const mongoose = require('mongoose');
const Schema = mongoose.Schema

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  leadTeacher: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  ta: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  courseImg: {
    type: String,
    required: true,
    default: 'https://d3gvvapon6fqzo.cloudfront.net/icons/default-course-image.png'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['ON', 'OFF']
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})


const Course = mongoose.model('Course', courseSchema)

module.exports = Course