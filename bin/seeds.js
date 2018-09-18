const mongoose       = require('mongoose');
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const User           = require('../models/user');
let salt             = bcrypt.genSaltSync(bcryptSalt);
const password       = "boss";
let encryptedPass    = bcrypt.hashSync(password, salt);
mongoose.connect("mongodb://localhost/lab-passport-roles");

const boss = new User({
  username: 'theboss',
  name: 'Gonzalo',
  familyName: 'M.',
  password: encryptedPass,
  role: 'Boss'
});

User.create(boss, (err, user) => {
  if (err) {
    throw err;
  }
  console.log("User saved on database", user);
  mongoose.connection.close();
});