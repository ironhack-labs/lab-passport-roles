const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

const dbName = 'IronhackBureauInvestigation';
mongoose.connect(`mongodb://localhost/${dbName}`);

const salt     = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync("a", salt);

const users = [
  {
    username: "a",
    password: hashPass,
    roles: "Boss"
  }
  
]

User.create(users, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${users.length} users`)
  mongoose.connection.close()
});