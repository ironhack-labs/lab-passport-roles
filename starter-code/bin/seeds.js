const mongoose = require('mongoose')
const User = require('../models/User')

mongoose.connect("mongodb://localhost/lab-passport-roles")

const users = [
  {
    email: 'gustavo.pema@gmail.com',
    password: '123',
    role: 'BOSS', 
  }
]

User.create(users, (err) => {
  if(err) { throw (err)}
  console.log(`You created ${users.length} users`)
  mongoose.connection.close()
})


