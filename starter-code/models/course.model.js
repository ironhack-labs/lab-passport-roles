const mongoose = require("mongoose")
const Schema = mongoose.Schema

const courseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  // alumni: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'alumni'
  // }
}, {
  timestamps: true
})

const Course = mongoose.model("Course", courseSchema)

module.exports = Course