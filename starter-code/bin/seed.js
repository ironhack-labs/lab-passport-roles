const mongoose = require('mongoose');

const dbName = 'ironpass';
mongoose.connect(`mongodb://localhost/${dbName}`);
const bcrypt = require('bcrypt');

const bcryptSalt = 10;

const User = require('../models/user');

const salt = bcrypt.genSaltSync(bcryptSalt);

const user = [
 {
   username: 'Gigio',
   password: bcrypt.hashSync('gigio', salt),
   role: 'boss',
 },
];

User.create(user, (err) => {
 if (err) { throw (err); }
 console.log(`Created ${user.length} users`);
 mongoose.connection.close();
});