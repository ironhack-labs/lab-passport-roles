const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: [true, 'Username is mandatory'],
		unique: [true, 'Username already exists']
	},
	name: String,
	familyName: String,
	password: {
		type: String,
		required: [true, 'Password is mandatory']
	},
	role: {
		type: String,
		enum: ["Boss", "Developer", "TA"]
	}
}, {
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
	});

const User = mongoose.model("User", userSchema);
module.exports = User;