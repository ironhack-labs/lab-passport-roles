const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(`mongodb://localhost/BossDeveloperTA`);


const Pass = 111;

const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(Pass, salt);

const users = [
  {
    name:  "Boss",
    password: hashPass,
    role: 'Boss',
  },

  {
    name:  "TA",
    password: hashPass,
    role: 'TA',
  },

  {
    name:  "Developer",
    password: hashPass,
    role: 'Developer',
  },
  
]

User.create(users, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${users.length} users`)
  mongoose.connection.close()
});