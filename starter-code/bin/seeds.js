// Uncomment to generate the users ↓
// const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const saltRounds = 5;

const User = require('../models/User');
const Course = require('../models/Course');

const securePassword = '123';

const salt = bcrypt.genSaltSync(saltRounds);

const hashedPassword = bcrypt.hashSync(securePassword, salt);

// Generate the users ↓

// mongoose
//   .connect('mongodb://localhost/passport-roles', { useNewUrlParser: true })
//   .then((x) => {
//     console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
//   })
//   .catch((err) => {
//     console.error('Error connecting to mongo', err);
//   });

const users = [
  {
    username: 'javi',
    password: hashedPassword,
    role: 'Boss',
  },
  {
    username: 'pepe',
    password: hashedPassword,
    role: 'Developer',
  },
  {
    username: 'lolo',
    password: hashedPassword,
    role: 'TA',
  },
];

const courses = [
  {
    name: 'Giorgio',
    content: 'Viva Giorgio',
  },
  {
    name: 'Diego',
    content: 'Viva Diego',
  },
  {
    name: 'Gabi',
    content: 'Viva Gabi',
  },
];

// User.create(users);
// Course.create(courses);
