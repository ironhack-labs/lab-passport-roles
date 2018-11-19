require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require("bcrypt");

mongoose.connect(`mongodb://localhost/${process.env.DBNAME}`);
User.collection.drop();
const users = [
  {
    username: "The Boss",
    password: "1234",
    role: "BOSS"
  },
  {
    username: "a developer",
    password: "1234",
    role: "DEVELOPER"
  },
  {
    username: "A TA",
    password: "1234",
    role: "TA"
  }
]

users.forEach((user)=>{
  const salt= bcrypt.genSaltSync(+process.env.BCRYPT_SALT);
  user.password= bcrypt.hashSync(user.password, salt);
})


User.create(users, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${users.length} users`)
  mongoose.connection.close()
});