const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const dbName = 'lab-passport-roles';

mongoose.connect(`mongodb://localhost/${dbName}`);

const user = [
  {
    username: 'henriqueMendes',
    password: '123456',
    role: 'BOSS'
  }
];

const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(user[0].password, salt);

user.forEach((el) => {
  el.password = hashPass;
});

User.create(user, (err) => {
  if (err) { throw (err); }
  console.log(`Created ${user.length} users`);
  mongoose.connection.close();
});
