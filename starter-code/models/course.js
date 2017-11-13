const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const coursesSchema = new Schema({
    name: String,
    startingDate: Date,
    endDate: Date,
    level: String,
    available: Boolean,
    },{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Course = mongoose.model("Course", coursesSchema);
module.exports = Course;
