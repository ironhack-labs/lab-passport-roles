const mongoose = require('mongoose');
const User = require('../models/user.model');

mongoose.connect('mongodb://localhost/passport-roles', { //Aqui no me ha dejado poner process.env.DB :(
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync("1234", salt);

const user = [{
  username: "Andrés",
  password: hashPass,
  role: "BOSS"
}]

User.create(user, err => {
  if (err) throw err
  console.log(`Se han creado ${user.length} usuarios`)
  mongoose.connection.close()
})