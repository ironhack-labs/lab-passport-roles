const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcrypt')
const bcryptsalt = 10

const dbName = 'Ironhackers-app-webmad1019';
mongoose.connect(`mongodb://localhost/${dbName}`);


const users =
{
  username: "asd",
  password: "asd",
  role: "BOSS"
}

const salt = bcrypt.genSaltSync(bcryptsalt)
const hashPass = bcrypt.hashSync(users.password, salt)


User.create({ username: users.username, password: hashPass, role: users.role })
  .then(newUser => console.log("Boss created"))
  .then(() => mongoose.connection.close())
  .catch(err => console.log("Error al pasar el new user", err))

