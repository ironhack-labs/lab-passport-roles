const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  teacher: {
    type: String,
    required: true
  },
  students: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Course", courseSchema);
