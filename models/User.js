const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const plm = require('passport-local-mongoose');


const userSchema = new Schema({
	username: {type: String, required:true},
	password: {type: String, required:true},
	role: {type: String, Enum: ['BOSS','DEVELOPER','TA'], default:'DEVELOPER'} 
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});


userSchema.plugin(plm,{usernameField:'username'});

const User = mongoose.model('User', userSchema);

module.exports = User;