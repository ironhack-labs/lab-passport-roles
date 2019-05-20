const mongoose = require('mongoose')
const Schema = mongoose.Schema


const courseSchema = new Schema({
  title: String,
  duration: Number,
  startDate: Date
   
})


const Course = new mongoose.model('Course', courseSchema)

module.exports = Course