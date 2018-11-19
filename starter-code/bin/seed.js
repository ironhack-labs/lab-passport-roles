const mongoose = require('mongoose');
const User = require('../models/User');
mongoose.connect(`mongodb://localhost/BossDeveloperTA`);
const bcrypt = require('bcrypt');
const Pass = "111";
const bcryptSalt = 10;

const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(Pass, salt);

//creo mis usuarios. esta es mi base de datos
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

//tienes que ejecutar node bin/seed.js para que se creen de fabrica