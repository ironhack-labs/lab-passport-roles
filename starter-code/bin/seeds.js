require('dotenv').config();

const mongoose = require('mongoose')
const passport = require('../handlers/passport')
const User = require('../models/User')

mongoose.connect(process.env.DB)

const boss = {
  username: 'Julián B.',
  role: 'The Boss'
}

User.register(boss, 'bossSpawned') 
  .then(user => {
    console.log(`The Boss has been spawned`)
    mongoose.connection.close()
  }) 
  .catch(err => console.log(err))


