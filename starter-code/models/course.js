const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  startingDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  level: {
    type: String
  },
  available: {
    type: Boolean
  }
});

module.exports = mongoose.model("Course", courseSchema);
