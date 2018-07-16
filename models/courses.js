const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const courseSchema = new Schema ({
  name:String, 
  cost: Number,
  members:[String]
});

const Courses = mongoose.model("Courses", courseSchema);

module.exports = Courses;