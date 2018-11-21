const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    creator: String,
    courseName:String,
    course: String,
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Course", courseSchema);
