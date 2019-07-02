const { model, Schema } = require("mongoose");

const courseSchema = new Schema(
	{
		name: String,
		desc: String
	},
	{
		versionKey: false,
		timestamps: true
	}
);

module.exports = model("Course", courseSchema);