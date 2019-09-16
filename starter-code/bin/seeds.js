
const mongoose = require('mongoose')
const User = require('../models/User')

const boss = 
  {
    name: 'Raul',
    lastName: 'Hernandez',
    passport: '1234',
    email: 'tortasdejamon@bienricas.com',
    role: 'BOSS'
  }

  mongoose
  .connect('mongodb://localhost/passport-roles', { useNewUrlParser: true })
  .then(async () => {
    const user = await User.register(boss, boss.password='1234')
    console.log(`Boss created`)
    mongoose.connection.close()
  })
  .catch(err => {
    console.log(err)
  })
