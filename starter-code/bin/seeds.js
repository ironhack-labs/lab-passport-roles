const mongoose = require('mongoose');
const User = require('../models/role.js');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const hashPass = bcrypt.hashSync("Boss", salt);

mongoose.connect(`mongodb://localhost/roleUsers`)
  .then(() => User.insertMany(users))
  .catch(err => {console.log(err)})



    

const users = [
  {
      username: "FuckingBoss",
      password: hashPass,
      role: "BOSS"
  }
]
