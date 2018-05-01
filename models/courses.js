const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const CoursesSchema = Schema({
  name:  String,
  desc:  String,
  owner: Schema.Types.ObjectId
});


const Courses = mongoose.model("Courses", CoursesSchema);






module.exports = CoursesSchema;