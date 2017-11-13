const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const courseSchema = new Schema({
  name: String,
  startingDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: Date.now },
  level: String,
  available: {
    type: String,
    required: [true, 'Please enter your availability']
  },

});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
