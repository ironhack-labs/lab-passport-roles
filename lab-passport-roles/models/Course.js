const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    teacherId: {
      type: String,
      required: true
    },
    studentsFBId: [{
      type: String,
      required: true
    }]
  },
  { timestamps: true },
)

module.exports = model('Course', courseSchema);