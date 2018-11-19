require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');

mongoose.connect(`mongodb://localhost/${process.env.DB}`);

const passwords = ["123", "456", "789"];
const saltRounds = 5;
const salt = bcrypt.genSaltSync(saltRounds);

const users = [
  {
    username: "Victor",
    password: bcrypt.hashSync(passwords[0], salt),
    rol: "Boss"
  },
  {
    username: "Dani",
    password: bcrypt.hashSync(passwords[1], salt),
    rol: "Developer"
  },
  {
    username: "JGGTD",
    password: bcrypt.hashSync(passwords[2], salt),
    rol: "TA"
  }
]

User.create(users, (err) => {
  if (err) { throw (err) }
  console.log(`Created ${users.length} users`)
  mongoose.connection.close()
});