const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
	{
		username: { type: String, unique: true },
		name: String,
		password: String,
		profileImg: {
			type: String,
			default: 'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png'
		},
		description: {
			type: String,
			default: ''
		},
		facebookId: {
			type: String,
			default: ''
		},
		role: {
			type: String,
			enum: ['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST'],
			default: 'GUEST'
		}
	},
	{
		timestamps: true
	}
)

const User = mongoose.model('User', userSchema)

module.exports = User
