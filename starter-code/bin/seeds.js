const mongoose = require('mongoose')
const Users = require('../models/user');
const bcrypt = require("bcrypt")
const bcryptSalt = 10;


const dbName = 'IBI';
mongoose.connect(`mongodb://localhost/${dbName}`);


const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync('123', salt);

const initialUser = [{
    username: 'Alfredo del Canto',
    password: hashPass,
    role: "BOSS"
  }    
]

Users.create(initialUser, (err) => {
    if (err) {
      throw err
    }
    console.log(`Created ${initialUser.length} users`)
    mongoose.connection.close;
  });