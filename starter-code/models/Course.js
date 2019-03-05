const mongoose = require("mongoose")
const Schema   = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const courseSchema = new Schema({
  title: String,
  description: String,
  students: [ObjectId]
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;