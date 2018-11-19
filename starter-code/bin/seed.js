const mongoose = require('mongoose');
const User = require('../models/User');
mongoose.connect(`mongodb://localhost/passport-roles`);
const bcrypt = require("bcrypt");
const passArray = ["123"];
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(passArray[0], salt);

const users = [
  {
    name:  "Boss",
    password:  hashPass,
    role: "Boss"
  },
  {
    name:  "Developer",
    password:  hashPass,
    role:"Developer"
  },
  {
    name:  "TA",
    password:  hashPass,
    role: "TA"
  }
]

User.create(users, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${users.length} users`)
  mongoose.connection.close()
});