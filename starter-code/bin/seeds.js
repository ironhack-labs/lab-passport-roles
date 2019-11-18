const mongoose = require('mongoose')
const Users = require('../models/user');

const dbName = 'IBI';
mongoose.connect(`mongodb://localhost/${dbName}`);


const initialUser = [{
    username: 'Alfredo del Canto',
    password: '123',
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