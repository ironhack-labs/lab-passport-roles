const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Course name is required"],
        unique: true
    },
    description: {
        type: String,
        required: [true, "Description is needed"]
    },
    creatorTA: {
        type: String
    },
    assignedTA: {
        type: String
    },
    duration: {
        type: Number,
        default: 1
    },
    students: {
        type: [ String ],
        default: []
    }
})

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;