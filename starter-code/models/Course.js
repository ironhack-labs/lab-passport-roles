const { Schema, model } = require('mongoose')
//const PLM = require('passport-local-mongoose')
const courseSchema = new Schema(
	{
		name: String,
		creator: String
	},
	{
		timestamps: true,
		versionKey: false
	}
)



module.exports = model('Course', courseSchema)