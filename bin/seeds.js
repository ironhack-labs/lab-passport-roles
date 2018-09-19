const mongoose = require('mongoose');
const User = require('../models/user');
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


const dbName = 'lab-passport-roles';
mongoose.connect(`mongodb://localhost/${dbName}`);

let password = 'boss1234'

const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(password, salt);

const newBoss = new User({
	username: "Boss",
	password: hashPass,
	roles: 'Boss'
})

User.collection.drop();

User.create(newBoss, (err) => {
	if (err) {
		throw (err)
	}
	console.log("Boss created")
	mongoose.connection.close()
});