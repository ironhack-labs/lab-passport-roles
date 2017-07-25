const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;


const courseSchema = new Schema ({
    name: String,
    startingDate: Date,
    endDate: Date,
    level: String,
    available: Boolean,
    students: [User.schema]
        
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
