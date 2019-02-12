let mongoose = require('mongoose')
let Schema = mongoose.Schema

let courseSchema = new Schema({
  title: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard']
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Course', courseSchema)