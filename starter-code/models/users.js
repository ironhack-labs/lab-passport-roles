const mongoose = require('mongoose')

module.exports = mongoose.model('User', new mongoose.Schema({
	username: String,
	password: String,
	name: String,
	familyName: String,
	role: {
		type: String,
		enum: ['BOSS', 'DEV', 'NOBODY'],
		default: 'NOBODY'
	}
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
}));