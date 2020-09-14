const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    title: String,
    leadTeacher:String,
    // leadTeacher: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    startDate: Date,
    endDate: Date,
    ta:String,
    // ta: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    courseImg: String,
    description: String,
    status: { type: String, enum: ['ON', 'OFF'] },
    students:String,
    // students: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    timestamps: true
  }
);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
