require('dotenv').config()
const mongoose = require("mongoose");
const User = require('../models/User');

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

const users = [
  {
    username: "The Boss",
    password: "password",
    role:     "Boss"
  },
  {
    username: "Developer01",
    password: "password",
    role:     "Developer"
  },
  {
    username: "Ta01",
    password: "password",
    role:     "TA"
  },
  {
    username: "Developer02",
    password: "password",
    role:     "Developer"
  },
  {
    username: "Ta02",
    password: "password",
    role:     "TA"
  },
  {
    username: "Developer03",
    password: "password",
    role:     "Developer"
  },
  {
    username: "Ta03",
    password: "password",
    role:     "TA"
  }, 
]


mongoose.connect(process.env.DB, {useNewUrlParser: true})
.then(() => {
  console.log(`Connected to mongoose`) 
})
.then(() => {
  return User.insertMany(users)
})
.then(user => {
  console.log(user) 
  mongoose.connection.close() 
})