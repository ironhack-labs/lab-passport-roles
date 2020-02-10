const mongoose = require("mongoose")
const Schema = mongoose.Schema

const courseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String
}, {
  timestamps: true
})

const Course = mongoose.model("Course", courseSchema)

module.exports = Course