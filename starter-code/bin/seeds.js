const mongoose = require('mongoose');
const User = require('../models/user')
const bcrypt = require("bcrypt");

// Connect to MongoDB via Mongoose
mongoose.connect('mongodb://localhost/starter-code') 
 
let data = [
  {name: 'JonSnow',
  password: '1234',
  role : 'BOSS'}
];

//bcrypt stuff
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(data.password, salt);

users.forEach((data) => {
  data.password = hashPass;
})

users.forEach((data) => {
  User.create(ele, (err) => {
    if (err) { throw(err) }
    console.log(`Created ${data.length} users`)
    mongoose.connection.close()
  })
});



//});
 
// Data array containing seed data - documents organized by Model
