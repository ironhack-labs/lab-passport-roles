require('dotenv').config();

const mongoose = require('mongoose')
const passport = require('../handlers/passport')
const User = require('../models/User')

mongoose.connect(process.env.DB)

const boss = {
  username: 'Julian',
  rol: 'BOSS'
}

User.register(boss, 'iamtheboss') 
  .then(user => {
    console.log(`You've created the boss user`)
    mongoose.connection.close()
  }) 
  .catch(err => console.log(err))


