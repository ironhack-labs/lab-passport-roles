const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const courseSchema = new Schema({
  name: String,
  startingDate: Date,
  endDate: Date,
  level: String,
  available: Boolean,
  students: [{idstudent: Schema.Types.ObjectId}]
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
