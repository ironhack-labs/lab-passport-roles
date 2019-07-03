const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const dbName = 'passport-roles';
mongoose.connect(`mongodb://127.0.0.1/${dbName}`);

const salt = bcrypt.genSaltSync();
const hashPass = bcrypt.hashSync('bossy', salt);

User.create({username: 'boss', 
password: hashPass,
role: 'BOSS',
firstName: 'Montasar',
lastName: 'Teacher',
profilePic: 'images/Montasar.png' })
.then(user => {
  console.log("Boss user successfully created! ", user.firstName);
  mongoose.connection.close();
})
.catch(err => console.log("error encountered adding boss: ", err));