const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  description: String
});

const courses = mongoose.model("Courses", userSchema);

module.exports = courses;