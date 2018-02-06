const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is mandatory']
	},
	startingDate: {
		type: Date,
		max: this.endDate
	},
	endDate: {
		type: Date,
		min: this.startingDate
	},
	level: {
		type: String,
		enum: ["Beginner", "Advanced"]
	},
	available: Boolean
}, {
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
	});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;