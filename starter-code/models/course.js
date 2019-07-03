const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {type: String, required: true },
  description: String,
  teacher: {
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  participants: [Schema.Types.ObjectId]
})

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;