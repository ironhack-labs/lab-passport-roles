const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt     = require("bcrypt");
const saltRounds = 10;
mongoose.connect(`mongodb://localhost/passport-roles`);
const pass = "111";

const salt  = bcrypt.genSaltSync(saltRounds);
const hashPass = bcrypt.hashSync(pass, salt);

const usersSeed = [
  {
    name: 'Solid Snake',
    password: hashPass,
    role: 'Boss',
  },
  {
    name: 'Aiden Pearce',
    password: hashPass,
    role: 'Developer',
  },
  {
    name: 'Super Mario',
    password: hashPass,
    role: 'TA',
  },
]


User.create(usersSeed, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${usersSeed.length} users`)
  mongoose.connection.close()
});