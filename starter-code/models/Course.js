const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const courseSchema = new Schema({
  coursename: {
    type: String,
    unique: true
  },
  coursecontent: {
    type: String,
    enum: ["WEB", "DATA", "UX"],
    default: "WEB"
  }
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
