// bin.seed.js

const mongoose = require('mongoose')
const User = require('../models/User.model.js')

const dbName = 'development'
mongoose.connect(`mongodb://localhost/${dbName}`)


// -----  USERS SEEDS -----
const users = [
    {
    username: 'BOSS',
    name: 'General Manager',
    password: 'BOSS',
    profileImg: " ",
    description: 'Ironhack General Manager ',
    facebookId: " ",
    role: 'BOSS'
    }
]

User
  .create(users)
  .then(allUsersCreated => {
    console.log(`Created ${allUsersCreated.length} users`)
    mongoose.connection.close()
  })
    .catch(err => console.log(err))