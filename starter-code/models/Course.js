const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = Schema({
    name: String,
    startingDate: String,
    endDate: String,
    level: String,
    available: boolean

})
const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
