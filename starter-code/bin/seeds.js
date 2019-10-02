const mongoose = require('mongoose');
const User = require('../models/user');
// const Course = require('../models/course');
const bcrypt = require("bcrypt");
const dbName = 'passport-roles';
mongoose.connect(`mongodb://127.0.0.1/${dbName}`);
const salt = bcrypt.genSaltSync();


let users = [{
    username: 'boss',
    password: bcrypt.hashSync('boss', salt),
    role: 'BOSS',
    firstName: 'SuperMan',
    lastName: 'The Big Boss'
  },
  {
    username: 'TAone',
    password: bcrypt.hashSync('TAone', salt),
    role: 'TA',
    firstName: 'MegaMan',
    lastName: 'The Big TA',
  },
  {
    username: 'TAtwo',
    password: bcrypt.hashSync('TAtwo', salt),
    role: 'TA',
    firstName: 'BomberMan',
    lastName: 'The Wonderful TA',
  },
  {
    username: 'Devs',
    password: bcrypt.hashSync('Devs', salt),
    role: 'DEVELOPER',
    firstName: 'PunchMan',
    lastName: 'The Dev',
  }
]


User.create(users, (err) => {
  if (err) {
    throw (err)
  }
  console.log(`Created "BOSS"`)
  mongoose.connection.close();
});