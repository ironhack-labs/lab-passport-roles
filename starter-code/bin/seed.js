
const mongoose = require('mongoose');
const User = require('../models/user.model')

const bcrypt = require("bcrypt");
const bcryptSalt = 10


const dbName = 'lab-passport-roles'
mongoose.connect(`mongodb://localhost/${dbName}`);

const salt = bcrypt.genSaltSync(bcryptSalt)

const user =
{
  username: "The Fucking Boss",
  password: bcrypt.hashSync('admin', salt),
  role: "Boss"
}


User.create(user)
  .then(userCreated => {
    console.log(`Creado el jefe ${userCreated}`)
    mongoose.connection.close()
  })
  .catch(err => console.log(`Hubo un error: ${err}`))