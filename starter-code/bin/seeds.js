const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

mongoose.connect('mongodb://localhost/companyDB');

const users = [
  {
    username: 'Jacinto',
    password: '111',
    role: 'Boss'
  },
  {
    username: 'Pepe',
    password: '222',
    role: 'Developer'
  },
  {
    username: 'Laura',
    password: '333',
    role: 'TA',
  }
];

const salt = bcrypt.genSaltSync(bcryptSalt);

users.forEach(function (user) {
  user.password = bcrypt.hashSync(user.password, salt);
});

User.create(users, (err) => {
  if (err) { throw (err) }
  mongoose.connection.close()
});
