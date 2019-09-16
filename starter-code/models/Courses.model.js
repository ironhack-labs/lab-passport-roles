const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coursesSchema = new Schema({
  code: {
    type: String,
    unique: true
  },
  name: {
    type: String
  },
  nAlumnis: {
    type: Number
  },
  year: {
    type: Number
  },
  month: {
    type: String,
    enum: [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "jule",
      "august",
      "september",
      "october",
      "november",
      "december"
    ]
  }
});

const Courses = mongoose.model("Courses", coursesSchema);

module.exports = Courses;
