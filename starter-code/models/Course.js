const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Development', 'Ux', 'Data'],
    default: 'Development',
    required: true
  },
  date: {
    type: Date,
    default: new Date
  }
});


const Course = mongoose.model("Course", courseSchema);
module.exports = Course;