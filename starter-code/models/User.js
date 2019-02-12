const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PLM = require('passport-local-mongoose')

const userSchema = new Schema({
	name: String,
	email: String,
	picture: String,
	role: {
		type: String,
		enum: ['BOSS', 'ALUMNI', 'TA'],
		default: 'ALUMNI'
	},
},{timestamps:true, versionKey: false})

module.exports = mongoose.model('User', userSchema.plugin(PLM, {usernameField: 'email'}))