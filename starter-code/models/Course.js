const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      unique: true
    },
    duration: Number,
    field: {
      type: String,
      enum: ["Web Development", "UX / UI Design", "Data Analytics"]
    },
    type: {
      type: String,
      enum: ["Full-Time", "Part-Time"]
    },
    // students: [ { type : Schema.Types.ObjectId, ref: 'User' } ]
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;