const mongoose = require('mongoose');
const User = require('../models/User');

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

mongoose
  .connect('mongodb://localhost/starter-code', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const users = [
  {
    username: 'Dani', 
    password: generatePassword('Dani'), 
    role: 'BOSS'
  }, 
  {
    username: 'Luciano', 
    password: generatePassword('luciano'), 
    role: 'DEVELOPER'
  },
  {
    username: 'Frank', 
    password: generatePassword('Frank'), 
    role: 'TA'
  }
];

User.create(users, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${users.length} users`);
  mongoose.connection.close();
})