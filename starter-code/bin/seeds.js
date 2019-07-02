require('dotenv').config()

const mongoose = require('mongoose')
const passport = require('../middlewares/passport')
const User = require('../models/User')

mongoose.connect(process.env.DB)

const boss = {
  username: 'Julian',
  password: 'ironhack',
  role: 'BOSS'
}

User.register(boss, boss.password)
.then(()=>{
  console.log('Boss user created successfully')
  mongoose.connection.close()
})
.catch(err => console.log(err))