const mongoose = require('mongoose');
const {Schema} = mongoose;

const courseSchema = new Schema({
  name: String,
  users: []
},{
  timestaps: {createdAt : "created_at", updatedAt: "updated_at"}
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;