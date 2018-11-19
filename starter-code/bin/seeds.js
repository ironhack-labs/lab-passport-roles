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
    username: 'Teo', 
    password: generatePassword('Teo'), 
    role: 'BOSS'
  }, 
  {
    username: 'Javi López', 
    password: generatePassword('Javi López'), 
    role: 'DEVELOPER'
  },
  {
    username: 'Christian', 
    password: generatePassword('Christian'), 
    role: 'TA'
  }
];

User.create(users, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${users.length} users`);
  mongoose.connection.close();
})

function generatePassword(pass) {
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  return bcrypt.hashSync(pass, salt);
}