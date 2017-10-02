const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
	username :{ type: String, required: [true, 'Please enter the name'] },
  name : String,
  familyName: String, //required: [true, 'Please enter the name'] },
  //email : { type: String, required: true},
  password : { type: String, required: [true, 'Please enter the password'] },
  role: {
  	type: String,
  	enum: ['TA', 'Developer', 'Boss'],
  	default: 'TA'
	},
  });

const User = mongoose.model('User', userSchema);
module.exports = User;