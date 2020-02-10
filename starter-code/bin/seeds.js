const mongoose = require('mongoose');
const Users = require('../models/User')
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

mongoose
    .connect('mongodb://localhost/passport-roles', { useNewUrlParser: true })
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch(err => {
        console.error('Error connecting to mongo', err)
    });
const password ="123"   
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(password, salt);

const users = [{
      username : "Dani",
      password : hashPass,
      role : "Boss"
    }]

Users.deleteMany().then(() => {
    Users.insertMany(users)
    .then(boss => {
      console.log({ alert: 'Database was seed' }, boss)
    })
    .catch(err => {
      console.log(err)
    })
})