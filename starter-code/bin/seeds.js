const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');


const dbName = 'roles';
mongoose.connect(`mongodb://localhost/${dbName}`);

const saltRounds = 10;

const users= [
  {
    userName: 'Diego',
    password: '1',
    role: 'BOSS'
  },
  {
    userName: 'Diego',
    password: '2',
    role: 'DEVELOPER'
  },
  {
    userName: 'Diego',
    password: '3',
    role: 'TA'
  },
] 

users.forEach((ele) => {
  const salt  = bcrypt.genSaltSync(saltRounds);
  const hashPwd = bcrypt.hashSync(ele.password, salt);
  ele.password = hashPwd;
})

users.forEach((ele) => {
  User.create(ele, (err) => {
    if (err) { throw(err) }
    console.log(`Created ${ele.length} users`)
    mongoose.connection.close()
  })
});