const mongoose = require('mongoose')

const User = require('../models/User')

const users = {
  password: 'secretoDeSeed',
  name: 'Julian',
  lastName: 'Ross',
  email: 'julian@mail.com',
  role: 'BOSS'
}

mongoose
  .connect('mongodb://localhost/passport-roles', { useNewUrlParser: true })
  .then(async () => {
    const userdata = await User.register(users, users.password)
    console.log(`User created`)
    mongoose.connection.close()
  })
  .catch(err => {
    console.log(err)
  })
