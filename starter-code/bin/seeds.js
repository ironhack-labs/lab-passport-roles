/*jshint esversion: 6 */
const mongoose = require('mongoose');
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const User = require('../models/user');

mongoose.connect("mongodb://localhost/ibi-ironhack");
var salt = bcrypt.genSaltSync(bcryptSalt);
const password = "ironhack";
var encryptedPass = bcrypt.hashSync(password, salt);

const boss = new User({
  username: 'theboss',
  name: 'Gonzalo',
  familyName: 'M.',
  password: encryptedPass,
  role: 'Boss'
});

const student = new User({
  username: 'thestudent',
  name: 'Thibaut',
  familyName: 'M.',
  password: encryptedPass,
  role: 'Developer'
});

const student2 = new User({
  username: 'thestudent2',
  name: 'Thibaut2',
  familyName: 'M.',
  password: encryptedPass,
  role: 'Developer'
});


User.create(student, student2, (err, user) => {
  if (err) {
    throw err;
  } user.save();
  console.log(user);
    mongoose.connection.close();
});
