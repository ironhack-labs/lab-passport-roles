const Rol = require("../models/rol");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

mongoose.connect('mongodb://localhost/lab-passport-roles');

const salt = bcrypt.genSaltSync(saltRounds);
const hashPass = bcrypt.hashSync('1234', salt);
const user = new Rol({
  user: 'Marc', role: 'Boss', password: hashPass
})

user.save()
  .then((user) => { 
    console.log('The user is saved and its value is: ', user);
    mongoose.connection.close();
 })
  .catch((err) => { console.log('An error happened:', err) });

