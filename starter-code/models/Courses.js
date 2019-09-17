const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    course: { type: String, unique: true },
    startDate: {type: Date},
    endDate: {type: Date}
  },
  {
    timestamps: true
  }
);

const Courses = mongoose.model("Courses", courseSchema);
module.exports = Courses;
