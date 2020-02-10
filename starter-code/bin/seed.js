const mongoose = require('mongoose');
const Empl = require('../models/empl.model');

const dbTitle = 'passport-roles';
mongoose.connect(`mongodb://localhost/${dbTitle}`);

const bcrypt = require("bcrypt")
const bcryptSalt = 10

Empl.collection.drop()

const salt = bcrypt.genSaltSync(bcryptSalt)
const hashPass = bcrypt.hashSync("123", salt)

const mySeed=[
  {
    "username": "G0d",
    "password": hashPass,
    "role": "BOSS",
  }
]

Empl.create(mySeed, (err) => {
  if (err) { throw (err) }
  console.log(`Created ${mySeed.length} empl`)
  mongoose.connection.close();
});