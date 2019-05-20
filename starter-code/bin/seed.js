const mongoose = require('mongoose');
const User = require('../models/user.model')

const dbName = 'RolesBB'
mongoose.connect(`mongodb://localhost/${dbName}`);

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const salt = bcrypt.genSaltSync(bcryptSalt)
const hashPass = bcrypt.hashSync("1234",salt)

const users = [
  {
  username: 'Germán',
  password: hashPass,
  roll: 'Boss'
  }
]

User.create(users)
  .then(usersCreated => {
    console.log(`Creados ${usersCreated.length} usuarios`)
    mongoose.connection.close()
  })
  .catch(err => console.log(`Hubo un error: ${err}`))
