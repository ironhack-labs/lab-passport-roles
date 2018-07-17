const mongoose = require("mongoose");
const constants = require("../constants");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const courseSchema = new mongoose.Schema({
    courseName: {
      type: String,
      required: [true, "name of the course is required"],
      unique: true
    },
    subject: {
      type: String,
      enum: [constants.courses.HTML, constants.courses.CSS, constants.courses.JAVASCRIPT],
      default: constants.courses.JAVASCRIPT
    },
    description: {
      type: String,
      minlength:20,
      maxlength:300,
      required:[true, 'description is required']
    },
    students: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
},
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
