
const mongoose = require('mongoose');
const User = require('../models/user');

const dbName = 'users';
mongoose.connect(`mongodb://localhost/${dbName}`);

const users = [
  {
    username: "Anna",
    password: "001",
    role: "BOSS"
  }
];

User.create(users, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${users.length} users`)
  mongoose.connection.close()
}); 