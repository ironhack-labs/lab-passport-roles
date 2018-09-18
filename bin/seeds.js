const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/lab-passport-roles');

const password = "123";
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(password, salt);

const generalManager = {
  name: "Marc",
  password: hashPass,
  role: 'Boss'
}

User.create(generalManager, (err) => {
  if (err) {
    throw(err)
  } 
  console.log('DB created')
  mongoose.connection.close();
})