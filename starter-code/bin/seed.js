const mongoose = require('mongoose');
const User = require('../models/User.model')

const dbname = "iron-bureau";
mongoose.connect(`mongodb://localhost/${dbname}`);


const bcrypt = require("bcrypt")
const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)
const hashPass = bcrypt.hashSync("1234", salt)

const users = [
  {
    username: "German",
    password: hashPass,
    role: "BOSS",
  }
]

User.create(users)