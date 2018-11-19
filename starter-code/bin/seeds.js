const mongoose = require("mongoose");
const User = require("../models/User");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


const dbName = "roles";
mongoose.connect(`mongodb://localhost/${dbName}`);

const passwords = ['121212', '131313', '141414'];
const hashPasswords = [];


for (var i = 0; i < passwords.length; i ++) {
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(passwords[i], salt);
  hashPasswords.push(hashPass);
}


const users = [{
  username: 'alberto',
  password: hashPasswords[0],
  role: 'Boss'
},
{
  username: 'david',
  password:  hashPasswords[1],
  role: 'Developer'
},
{
  username: 'christian',
  password:  hashPasswords[2],
  role: 'TA'
}
]

User.create(users, err => {
  if (err) {
    throw err;
  }
  console.log(`Ceated user`);
  mongoose.connection.close();
});