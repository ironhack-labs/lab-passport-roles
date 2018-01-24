const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Course name is required']
    },
    startingDate: {
        type: Date,
        required: [true, 'Starting date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    level: {
        type: String,
        required: [true, 'Level is required']
    },
    available: {
        type: Boolean,
        required: [true, 'Available is required']
    },
    students: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    }
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;