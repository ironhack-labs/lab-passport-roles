const Schema = require('mongoose').Schema

const courseSchema = new Schema({
	title: String,
	difficulty: {
		type: String,
		enum: ['easy', 'medium', 'hard', 'tenemos que poner reggaeton para acabar']
	},
},{timestamps:true})

module.exports = require('mongoose').model('Course', courseSchema)