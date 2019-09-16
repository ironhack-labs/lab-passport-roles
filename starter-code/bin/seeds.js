const mongoose = require('mongoose')
const User = require('../models/User')

const boss = {
  name: 'Elijah',
  lastName: 'Wood',
  email: 'ironjuannn@gmail.com',
  role: 'BOSS'
}

mongoose
  .connect('mongodb://localhost/passport-roles', {
    useNewUrlParser: true
  })
  .then(async () => {
    const user = await User.register(boss, boss.password = '123')
    console.log(`Boss created`)
    mongoose.connection.close()
  })
  .catch(err => {
    console.log(err)
  })