const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
  title: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  }
}, {
  timestamps: true,
    versionKey: false
  })

module.exports = mongoose.model('Course', courseSchema)