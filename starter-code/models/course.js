const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
  TA: String,
  name: String,
  description: String,
  date: Date
})

const Course = mongoose.model('Course', courseSchema)
module.exports = Course