const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newCourse = new Schema({
    title: String,
    description: String,
    content: String,
    resource: String
});

const Course = mongoose.model('Course', newCourse);

module.exports = Course;